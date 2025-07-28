import { V as o, r as u } from './iframe-Cy2I62ob.js';
import { e as n } from './index-BB5JR4LJ.js';
function d(e) {
  const t = u.useRef(e);
  return (
    u.useEffect(() => {
      t.current = e;
    }),
    u.useMemo(
      () =>
        (...s) => {
          let r;
          return (r = t.current) == null ? void 0 : r.call(t, ...s);
        },
      []
    )
  );
}
const a = o[' useId '.trim().toString()] || (() => {});
let f = 0;
function m(e) {
  const [t, s] = u.useState(a());
  return (
    n(() => {
      s((r) => r ?? String(f++));
    }, [e]),
    e || (t ? `radix-${t}` : '')
  );
}
export { d as a, m as u };
