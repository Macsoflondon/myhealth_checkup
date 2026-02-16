/**
 * Evenly distributed decorative circles for navy (#081129) background sections.
 * Uses faint pink and turquoise with higher visibility than before.
 * Circles are positioned across a grid to avoid clustering.
 */
const NavyDecorativeCircles = () => {
  return (
    <>
      {/* Row 1 – top edge */}
      <div className="absolute top-[2%] left-[5%] w-40 h-40 bg-brand-pink/[0.08] rounded-full" />
      <div className="absolute top-[3%] left-[30%] w-52 h-52 bg-brand-turquoise/[0.07] rounded-full -translate-y-1/3" />
      <div className="absolute top-[1%] left-[55%] w-36 h-36 bg-brand-pink/[0.06] rounded-full" />
      <div className="absolute top-[4%] right-[8%] w-48 h-48 bg-brand-turquoise/[0.08] rounded-full translate-x-1/4" />

      {/* Row 2 – upper quarter */}
      <div className="absolute top-[20%] left-[0%] w-56 h-56 bg-brand-turquoise/[0.07] rounded-full -translate-x-1/3" />
      <div className="absolute top-[18%] left-[25%] w-44 h-44 bg-brand-pink/[0.07] rounded-full" />
      <div className="absolute top-[22%] left-[50%] w-48 h-48 bg-brand-turquoise/[0.06] rounded-full" />
      <div className="absolute top-[16%] right-[5%] w-40 h-40 bg-brand-pink/[0.08] rounded-full translate-x-1/3" />

      {/* Row 3 – middle */}
      <div className="absolute top-[40%] left-[8%] w-44 h-44 bg-brand-pink/[0.06] rounded-full" />
      <div className="absolute top-[42%] left-[35%] w-52 h-52 bg-brand-turquoise/[0.08] rounded-full" />
      <div className="absolute top-[38%] left-[60%] w-40 h-40 bg-brand-pink/[0.07] rounded-full" />
      <div className="absolute top-[44%] right-[2%] w-56 h-56 bg-brand-turquoise/[0.06] rounded-full translate-x-1/4" />

      {/* Row 4 – lower quarter */}
      <div className="absolute top-[60%] left-[0%] w-48 h-48 bg-brand-turquoise/[0.07] rounded-full -translate-x-1/4" />
      <div className="absolute top-[62%] left-[22%] w-40 h-40 bg-brand-pink/[0.08] rounded-full" />
      <div className="absolute top-[58%] left-[48%] w-52 h-52 bg-brand-turquoise/[0.06] rounded-full" />
      <div className="absolute top-[64%] right-[8%] w-44 h-44 bg-brand-pink/[0.07] rounded-full" />

      {/* Row 5 – bottom edge */}
      <div className="absolute bottom-[5%] left-[10%] w-52 h-52 bg-brand-pink/[0.07] rounded-full translate-y-1/3" />
      <div className="absolute bottom-[3%] left-[38%] w-44 h-44 bg-brand-turquoise/[0.08] rounded-full translate-y-1/4" />
      <div className="absolute bottom-[6%] left-[65%] w-48 h-48 bg-brand-pink/[0.06] rounded-full" />
      <div className="absolute bottom-[2%] right-[3%] w-40 h-40 bg-brand-turquoise/[0.07] rounded-full translate-x-1/3 translate-y-1/3" />
    </>
  );
};

export { NavyDecorativeCircles };
