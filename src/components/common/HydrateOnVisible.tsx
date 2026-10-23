import {
  lazy,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from "react";

/**
 * Below-the-fold sections, server-rendered but hydrated only when they near
 * the viewport.
 *
 * During the first hydration the wrapper reads its own server HTML and hands
 * it back to React as the same markup through dangerouslySetInnerHTML, so
 * React keeps the DOM exactly as served and does not load or run the
 * section's code. Visitors and crawlers see the whole section at once.
 *
 * Once the wrapper comes within `rootMargin` of the viewport it awaits `load`
 * (the section's lazy import) and then renders the live component in place of
 * that markup. Awaiting first lets the swap render the module synchronously,
 * so no Suspense fallback shows in between.
 *
 * React's own selective hydration (suspending inside a Suspense boundary) is
 * not used: any context update above a dehydrated boundary, such as the auth
 * session or router state settling, makes React hydrate it at once.
 *
 * On the server and on client-side navigations children render as usual.
 */

const noopSubscribe = () => () => {};

/**
 * True while React is hydrating server HTML (it reads getServerSnapshot then),
 * false on a normal client render such as a client-side navigation.
 */
function useIsHydrating() {
  return useSyncExternalStore(
    noopSubscribe,
    () => false,
    () => true,
  );
}

type WrapperState = { live: true } | { live: false; html: { __html: string } };

export function HydrateOnVisible({
  children,
  load,
  rootMargin = "600px 0px",
}: {
  children: ReactNode;
  /** Loads the section's code before it goes live (e.g. Component.preload). */
  load: () => Promise<unknown>;
  rootMargin?: string;
}) {
  // useId matches between the server render and hydration, so the wrapper
  // can find its own server HTML before React has attached to it.
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const isHydrating = useIsHydrating();
  const [state, setState] = useState<WrapperState>(() => {
    if (typeof document === "undefined" || !isHydrating) return { live: true };
    const el = document.querySelector(`[data-hydrate-on-visible="${id}"]`);
    return el
      ? { live: false, html: { __html: el.innerHTML } }
      : { live: true };
  });

  useEffect(() => {
    if (state.live) return;
    let cancelled = false;
    const goLive = () => {
      load().then(
        () => !cancelled && setState({ live: true }),
        () => !cancelled && setState({ live: true }),
      );
    };
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      goLive();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          goLive();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [state.live, load, rootMargin]);

  if (state.live) {
    return (
      <div ref={ref} data-hydrate-on-visible={id}>
        {children}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      data-hydrate-on-visible={id}
      suppressHydrationWarning
      dangerouslySetInnerHTML={state.html}
    />
  );
}

export type PreloadableComponent<P> = ((props: P) => ReactNode) & {
  preload: () => Promise<unknown>;
};

/**
 * React.lazy plus a preload() that, once resolved, lets the component render
 * without suspending.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches React.lazy's own constraint
export function lazyPreloadable<C extends ComponentType<any>>(
  factory: () => Promise<{ default: C }>,
): PreloadableComponent<ComponentProps<C>> {
  let loaded: C | undefined;
  let pending: Promise<unknown> | undefined;
  const preload = () =>
    (pending ??= factory().then((m) => {
      loaded = m.default;
    }));
  const Lazy = lazy(factory);
  const Component = (props: ComponentProps<C>) => {
    const Loaded = loaded;
    return Loaded ? <Loaded {...props} /> : <Lazy {...props} />;
  };
  Component.preload = preload;
  return Component;
}
