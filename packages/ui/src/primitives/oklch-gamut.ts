/**
 * Inline OKLCH gamut classification
 * Pure math: oklch -> oklab -> LMS cubed -> linear-RGB -> in-gamut check
 * Zero dependencies, zero side effects
 */

const RAD = Math.PI / 180;

/** Floating-point tolerance for gamut boundary checks */
const EPS = 0.001;

/** Convert OKLCH to cubed LMS via Oklab (shared pipeline for both gamuts) */
function toLmsCubed(l: number, c: number, h: number): [number, number, number] {
  // Polar (LCH) to cartesian (Lab)
  const a = c * Math.cos(h * RAD);
  const b = c * Math.sin(h * RAD);

  // Oklab to LMS (prime form -- spec notation: l', m', s')
  const lp = l + 0.3963377774 * a + 0.2158037573 * b;
  const mp = l - 0.1055613458 * a - 0.0638541728 * b;
  const sp = l - 0.0894841775 * a - 1.2914855480 * b;

  return [lp * lp * lp, mp * mp * mp, sp * sp * sp];
}

function inRange(v: number): boolean {
  return v >= -EPS && v <= 1 + EPS;
}

/** Check whether an OKLCH color is within the sRGB gamut */
export function inSrgb(l: number, c: number, h: number): boolean {
  const [L, M, S] = toLmsCubed(l, c, h);
  return (
    inRange(+4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S) &&
    inRange(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S) &&
    inRange(-0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S)
  );
}

/** Check whether an OKLCH color is within the Display P3 gamut */
export function inP3(l: number, c: number, h: number): boolean {
  const [L, M, S] = toLmsCubed(l, c, h);
  return (
    inRange(+3.1277147370 * L - 2.2571303530 * M + 0.1294156160 * S) &&
    inRange(-1.0910898340 * L + 2.4133174100 * M - 0.3222275760 * S) &&
    inRange(-0.0260731810 * L - 0.7034860280 * M + 1.7295592090 * S)
  );
}
