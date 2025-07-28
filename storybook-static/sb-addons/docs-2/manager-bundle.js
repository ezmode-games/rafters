try {
  (() => {
    const u = __REACT__;
    const {
      Children: ur,
      Component: dr,
      Fragment: fr,
      Profiler: mr,
      PureComponent: cr,
      StrictMode: hr,
      Suspense: br,
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: gr,
      act: yr,
      cloneElement: vr,
      createContext: xr,
      createElement: Sr,
      createFactory: _r,
      createRef: kr,
      forwardRef: Tr,
      isValidElement: wr,
      lazy: Pr,
      memo: Cr,
      startTransition: Er,
      unstable_act: Rr,
      useCallback: Ir,
      useContext: Or,
      useDebugValue: Fr,
      useDeferredValue: jr,
      useEffect: G,
      useId: Hr,
      useImperativeHandle: zr,
      useInsertionEffect: Ar,
      useLayoutEffect: Mr,
      useMemo: Br,
      useReducer: Nr,
      useRef: Lr,
      useState: K,
      useSyncExternalStore: Dr,
      useTransition: $r,
      version: qr,
    } = __REACT__;
    const Ur = __STORYBOOK_COMPONENTS__;
    const {
      A: Zr,
      ActionBar: Jr,
      AddonPanel: U,
      Badge: Qr,
      Bar: Xr,
      Blockquote: Vr,
      Button: et,
      Checkbox: rt,
      ClipboardCode: tt,
      Code: at,
      DL: nt,
      Div: ot,
      DocumentWrapper: st,
      EmptyTabContent: it,
      ErrorFormatter: pt,
      FlexBar: lt,
      Form: ut,
      H1: dt,
      H2: ft,
      H3: mt,
      H4: ct,
      H5: ht,
      H6: bt,
      HR: gt,
      IconButton: yt,
      Img: vt,
      LI: xt,
      Link: St,
      ListItem: _t,
      Loader: kt,
      Modal: Tt,
      OL: wt,
      P: Pt,
      Placeholder: Ct,
      Pre: Et,
      ProgressSpinner: Rt,
      ResetWrapper: It,
      ScrollArea: Ot,
      Separator: Ft,
      Spaced: jt,
      Span: Ht,
      StorybookIcon: zt,
      StorybookLogo: At,
      SyntaxHighlighter: Z,
      TT: Mt,
      TabBar: Bt,
      TabButton: Nt,
      TabWrapper: Lt,
      Table: Dt,
      Tabs: $t,
      TabsState: qt,
      TooltipLinkList: Wt,
      TooltipMessage: Yt,
      TooltipNote: Gt,
      UL: Kt,
      WithTooltip: Ut,
      WithTooltipPure: Zt,
      Zoom: Jt,
      codeCommon: Qt,
      components: Xt,
      createCopyToClipboardFunction: Vt,
      getStoryHref: ea,
      interleaveSeparators: ra,
      nameSpaceClassNames: ta,
      resetComponents: aa,
      withReset: J,
    } = __STORYBOOK_COMPONENTS__;
    const pa = __STORYBOOK_API__;
    const {
      ActiveTabs: la,
      Consumer: ua,
      ManagerContext: da,
      Provider: fa,
      RequestResponseError: ma,
      addons: j,
      combineParameters: ca,
      controlOrMetaKey: ha,
      controlOrMetaSymbol: ba,
      eventMatchesShortcut: ga,
      eventToShortcut: ya,
      experimental_MockUniversalStore: va,
      experimental_UniversalStore: xa,
      experimental_getStatusStore: Sa,
      experimental_getTestProviderStore: _a,
      experimental_requestResponse: ka,
      experimental_useStatusStore: Ta,
      experimental_useTestProviderStore: wa,
      experimental_useUniversalStore: Pa,
      internal_fullStatusStore: Ca,
      internal_fullTestProviderStore: Ea,
      internal_universalStatusStore: Ra,
      internal_universalTestProviderStore: Ia,
      isMacLike: Oa,
      isShortcutTaken: Fa,
      keyToSymbol: ja,
      merge: Ha,
      mockChannel: za,
      optionOrAltSymbol: Aa,
      shortcutMatchesShortcut: Ma,
      shortcutToHumanString: Ba,
      types: Q,
      useAddonState: Na,
      useArgTypes: La,
      useArgs: Da,
      useChannel: X,
      useGlobalTypes: $a,
      useGlobals: qa,
      useParameter: V,
      useSharedState: Wa,
      useStoryPrepared: Ya,
      useStorybookApi: Ga,
      useStorybookState: Ka,
    } = __STORYBOOK_API__;
    const Xa = __STORYBOOK_THEMING__;
    const {
      CacheProvider: Va,
      ClassNames: en,
      Global: rn,
      ThemeProvider: ee,
      background: tn,
      color: an,
      convert: re,
      create: nn,
      createCache: on,
      createGlobal: sn,
      createReset: pn,
      css: ln,
      darken: un,
      ensure: dn,
      ignoreSsrWarning: H,
      isPropValid: fn,
      jsx: mn,
      keyframes: cn,
      lighten: hn,
      styled: x,
      themes: z,
      typography: bn,
      useTheme: A,
      withTheme: gn,
    } = __STORYBOOK_THEMING__;
    const W = 'storybook/docs';
    const ue = `${W}/panel`;
    const te = 'docs';
    const ae = `${W}/snippet-rendered`;
    function d() {
      return (
        (d = Object.assign
          ? Object.assign.bind()
          : (e) => {
              for (let r = 1; r < arguments.length; r++) {
                const t = arguments[r];
                for (const a in t) ({}).hasOwnProperty.call(t, a) && (e[a] = t[a]);
              }
              return e;
            }),
        d.apply(null, arguments)
      );
    }
    function de(e) {
      if (e === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return e;
    }
    function C(e, r) {
      return (
        (C = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : (t, a) => ((t.__proto__ = a), t)),
        C(e, r)
      );
    }
    function fe(e, r) {
      (e.prototype = Object.create(r.prototype)), (e.prototype.constructor = e), C(e, r);
    }
    function L(e) {
      return (
        (L = Object.setPrototypeOf
          ? Object.getPrototypeOf.bind()
          : (r) => r.__proto__ || Object.getPrototypeOf(r)),
        L(e)
      );
    }
    function me(e) {
      try {
        return Function.toString.call(e).indexOf('[native code]') !== -1;
      } catch {
        return typeof e === 'function';
      }
    }
    function oe() {
      try {
        const e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => {}));
      } catch {}
      return (oe = () => !!e)();
    }
    function ce(e, r, t) {
      if (oe()) return Reflect.construct.apply(null, arguments);
      const a = [null];
      a.push.apply(a, r);
      const n = new (e.bind.apply(e, a))();
      return t && C(n, t.prototype), n;
    }
    function D(e) {
      const r = typeof Map === 'function' ? new Map() : void 0;
      return (
        (D = (t) => {
          if (t === null || !me(t)) return t;
          if (typeof t !== 'function')
            throw new TypeError('Super expression must either be null or a function');
          if (r !== void 0) {
            if (r.has(t)) return r.get(t);
            r.set(t, a);
          }
          function a() {
            return ce(t, arguments, L(this).constructor);
          }
          return (
            (a.prototype = Object.create(t.prototype, {
              constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 },
            })),
            C(a, t)
          );
        }),
        D(e)
      );
    }
    const he = {
      1: `Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,
      2: `Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,
      3: `Passed an incorrect argument to a color function, please pass a string representation of a color.

`,
      4: `Couldn't generate valid rgb string from %s, it returned %s.

`,
      5: `Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,
      6: `Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,
      7: `Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,
      8: `Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,
      9: `Please provide a number of steps to the modularScale helper.

`,
      10: `Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,
      11: `Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,
      12: `Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,
      13: `Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,
      14: `Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,
      15: `Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,
      16: `You must provide a template to this method.

`,
      17: `You passed an unsupported selector state to this method.

`,
      18: `minScreen and maxScreen must be provided as stringified numbers with the same units.

`,
      19: `fromSize and toSize must be provided as stringified numbers with the same units.

`,
      20: `expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,
      21: 'expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n',
      22: 'expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n',
      23: `fontFace expects a name of a font-family.

`,
      24: `fontFace expects either the path to the font file(s) or a name of a local copy.

`,
      25: `fontFace expects localFonts to be an array.

`,
      26: `fontFace expects fileFormats to be an array.

`,
      27: `radialGradient requries at least 2 color-stops to properly render.

`,
      28: `Please supply a filename to retinaImage() as the first argument.

`,
      29: `Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,
      30: 'Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n',
      31: `The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,
      32: `To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,
      33: `The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,
      34: `borderRadius expects a radius value as a string or number as the second argument.

`,
      35: `borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,
      36: `Property must be a string value.

`,
      37: `Syntax Error at %s.

`,
      38: `Formula contains a function that needs parentheses at %s.

`,
      39: `Formula is missing closing parenthesis at %s.

`,
      40: `Formula has too many closing parentheses at %s.

`,
      41: `All values in a formula must have the same unit or be unitless.

`,
      42: `Please provide a number of steps to the modularScale helper.

`,
      43: `Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,
      44: `Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,
      45: `Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,
      46: `Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,
      47: `minScreen and maxScreen must be provided as stringified numbers with the same units.

`,
      48: `fromSize and toSize must be provided as stringified numbers with the same units.

`,
      49: `Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,
      50: `Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,
      51: `Expects the first argument object to have the properties prop, fromSize, and toSize.

`,
      52: `fontFace expects either the path to the font file(s) or a name of a local copy.

`,
      53: `fontFace expects localFonts to be an array.

`,
      54: `fontFace expects fileFormats to be an array.

`,
      55: `fontFace expects a name of a font-family.

`,
      56: `linearGradient requries at least 2 color-stops to properly render.

`,
      57: `radialGradient requries at least 2 color-stops to properly render.

`,
      58: `Please supply a filename to retinaImage() as the first argument.

`,
      59: `Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,
      60: 'Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n',
      61: `Property must be a string value.

`,
      62: `borderRadius expects a radius value as a string or number as the second argument.

`,
      63: `borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,
      64: `The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,
      65: `To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,
      66: `The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,
      67: `You must provide a template to this method.

`,
      68: `You passed an unsupported selector state to this method.

`,
      69: `Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,
      70: `Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,
      71: `Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,
      72: `Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,
      73: `Please provide a valid CSS variable.

`,
      74: `CSS variable not found and no default was provided.

`,
      75: `important requires a valid style object, got a %s instead.

`,
      76: `fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,
      77: `remToPx expects a value in "rem" but you provided it in "%s".

`,
      78: `base must be set in "px" or "%" but you set it in "%s".
`,
    };
    function be() {
      for (let e = arguments.length, r = new Array(e), t = 0; t < e; t++) r[t] = arguments[t];
      let a = r[0];
      const n = [];
      let o;
      for (o = 1; o < r.length; o += 1) n.push(r[o]);
      return (
        n.forEach((s) => {
          a = a.replace(/%[a-z]/, s);
        }),
        a
      );
    }
    const b = ((e) => {
      fe(r, e);
      function r(t) {
        for (let a, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
          o[s - 1] = arguments[s];
        return (a = e.call(this, be.apply(void 0, [he[t]].concat(o))) || this), de(a);
      }
      return r;
    })(D(Error));
    function M(e) {
      return Math.round(e * 255);
    }
    function ge(e, r, t) {
      return `${M(e)},${M(r)},${M(t)}`;
    }
    function E(e, r, t, a) {
      if ((a === void 0 && (a = ge), r === 0)) return a(t, t, t);
      const n = (((e % 360) + 360) % 360) / 60;
      const o = (1 - Math.abs(2 * t - 1)) * r;
      const s = o * (1 - Math.abs((n % 2) - 1));
      let i = 0;
      let p = 0;
      let l = 0;
      n >= 0 && n < 1
        ? ((i = o), (p = s))
        : n >= 1 && n < 2
          ? ((i = s), (p = o))
          : n >= 2 && n < 3
            ? ((p = o), (l = s))
            : n >= 3 && n < 4
              ? ((p = s), (l = o))
              : n >= 4 && n < 5
                ? ((i = s), (l = o))
                : n >= 5 && n < 6 && ((i = o), (l = s));
      const h = t - o / 2;
      const c = i + h;
      const f = p + h;
      const k = l + h;
      return a(c, f, k);
    }
    const ne = {
      aliceblue: 'f0f8ff',
      antiquewhite: 'faebd7',
      aqua: '00ffff',
      aquamarine: '7fffd4',
      azure: 'f0ffff',
      beige: 'f5f5dc',
      bisque: 'ffe4c4',
      black: '000',
      blanchedalmond: 'ffebcd',
      blue: '0000ff',
      blueviolet: '8a2be2',
      brown: 'a52a2a',
      burlywood: 'deb887',
      cadetblue: '5f9ea0',
      chartreuse: '7fff00',
      chocolate: 'd2691e',
      coral: 'ff7f50',
      cornflowerblue: '6495ed',
      cornsilk: 'fff8dc',
      crimson: 'dc143c',
      cyan: '00ffff',
      darkblue: '00008b',
      darkcyan: '008b8b',
      darkgoldenrod: 'b8860b',
      darkgray: 'a9a9a9',
      darkgreen: '006400',
      darkgrey: 'a9a9a9',
      darkkhaki: 'bdb76b',
      darkmagenta: '8b008b',
      darkolivegreen: '556b2f',
      darkorange: 'ff8c00',
      darkorchid: '9932cc',
      darkred: '8b0000',
      darksalmon: 'e9967a',
      darkseagreen: '8fbc8f',
      darkslateblue: '483d8b',
      darkslategray: '2f4f4f',
      darkslategrey: '2f4f4f',
      darkturquoise: '00ced1',
      darkviolet: '9400d3',
      deeppink: 'ff1493',
      deepskyblue: '00bfff',
      dimgray: '696969',
      dimgrey: '696969',
      dodgerblue: '1e90ff',
      firebrick: 'b22222',
      floralwhite: 'fffaf0',
      forestgreen: '228b22',
      fuchsia: 'ff00ff',
      gainsboro: 'dcdcdc',
      ghostwhite: 'f8f8ff',
      gold: 'ffd700',
      goldenrod: 'daa520',
      gray: '808080',
      green: '008000',
      greenyellow: 'adff2f',
      grey: '808080',
      honeydew: 'f0fff0',
      hotpink: 'ff69b4',
      indianred: 'cd5c5c',
      indigo: '4b0082',
      ivory: 'fffff0',
      khaki: 'f0e68c',
      lavender: 'e6e6fa',
      lavenderblush: 'fff0f5',
      lawngreen: '7cfc00',
      lemonchiffon: 'fffacd',
      lightblue: 'add8e6',
      lightcoral: 'f08080',
      lightcyan: 'e0ffff',
      lightgoldenrodyellow: 'fafad2',
      lightgray: 'd3d3d3',
      lightgreen: '90ee90',
      lightgrey: 'd3d3d3',
      lightpink: 'ffb6c1',
      lightsalmon: 'ffa07a',
      lightseagreen: '20b2aa',
      lightskyblue: '87cefa',
      lightslategray: '789',
      lightslategrey: '789',
      lightsteelblue: 'b0c4de',
      lightyellow: 'ffffe0',
      lime: '0f0',
      limegreen: '32cd32',
      linen: 'faf0e6',
      magenta: 'f0f',
      maroon: '800000',
      mediumaquamarine: '66cdaa',
      mediumblue: '0000cd',
      mediumorchid: 'ba55d3',
      mediumpurple: '9370db',
      mediumseagreen: '3cb371',
      mediumslateblue: '7b68ee',
      mediumspringgreen: '00fa9a',
      mediumturquoise: '48d1cc',
      mediumvioletred: 'c71585',
      midnightblue: '191970',
      mintcream: 'f5fffa',
      mistyrose: 'ffe4e1',
      moccasin: 'ffe4b5',
      navajowhite: 'ffdead',
      navy: '000080',
      oldlace: 'fdf5e6',
      olive: '808000',
      olivedrab: '6b8e23',
      orange: 'ffa500',
      orangered: 'ff4500',
      orchid: 'da70d6',
      palegoldenrod: 'eee8aa',
      palegreen: '98fb98',
      paleturquoise: 'afeeee',
      palevioletred: 'db7093',
      papayawhip: 'ffefd5',
      peachpuff: 'ffdab9',
      peru: 'cd853f',
      pink: 'ffc0cb',
      plum: 'dda0dd',
      powderblue: 'b0e0e6',
      purple: '800080',
      rebeccapurple: '639',
      red: 'f00',
      rosybrown: 'bc8f8f',
      royalblue: '4169e1',
      saddlebrown: '8b4513',
      salmon: 'fa8072',
      sandybrown: 'f4a460',
      seagreen: '2e8b57',
      seashell: 'fff5ee',
      sienna: 'a0522d',
      silver: 'c0c0c0',
      skyblue: '87ceeb',
      slateblue: '6a5acd',
      slategray: '708090',
      slategrey: '708090',
      snow: 'fffafa',
      springgreen: '00ff7f',
      steelblue: '4682b4',
      tan: 'd2b48c',
      teal: '008080',
      thistle: 'd8bfd8',
      tomato: 'ff6347',
      turquoise: '40e0d0',
      violet: 'ee82ee',
      wheat: 'f5deb3',
      white: 'fff',
      whitesmoke: 'f5f5f5',
      yellow: 'ff0',
      yellowgreen: '9acd32',
    };
    function ye(e) {
      if (typeof e !== 'string') return e;
      const r = e.toLowerCase();
      return ne[r] ? `#${ne[r]}` : e;
    }
    const ve = /^#[a-fA-F0-9]{6}$/;
    const xe = /^#[a-fA-F0-9]{8}$/;
    const Se = /^#[a-fA-F0-9]{3}$/;
    const _e = /^#[a-fA-F0-9]{4}$/;
    const B = /^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i;
    const ke =
      /^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
    const Te =
      /^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i;
    const we =
      /^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
    function S(e) {
      if (typeof e !== 'string') throw new b(3);
      const r = ye(e);
      if (r.match(ve))
        return {
          red: Number.parseInt(`${r[1]}${r[2]}`, 16),
          green: Number.parseInt(`${r[3]}${r[4]}`, 16),
          blue: Number.parseInt(`${r[5]}${r[6]}`, 16),
        };
      if (r.match(xe)) {
        const t = Number.parseFloat((Number.parseInt(`${r[7]}${r[8]}`, 16) / 255).toFixed(2));
        return {
          red: Number.parseInt(`${r[1]}${r[2]}`, 16),
          green: Number.parseInt(`${r[3]}${r[4]}`, 16),
          blue: Number.parseInt(`${r[5]}${r[6]}`, 16),
          alpha: t,
        };
      }
      if (r.match(Se))
        return {
          red: Number.parseInt(`${r[1]}${r[1]}`, 16),
          green: Number.parseInt(`${r[2]}${r[2]}`, 16),
          blue: Number.parseInt(`${r[3]}${r[3]}`, 16),
        };
      if (r.match(_e)) {
        const a = Number.parseFloat((Number.parseInt(`${r[4]}${r[4]}`, 16) / 255).toFixed(2));
        return {
          red: Number.parseInt(`${r[1]}${r[1]}`, 16),
          green: Number.parseInt(`${r[2]}${r[2]}`, 16),
          blue: Number.parseInt(`${r[3]}${r[3]}`, 16),
          alpha: a,
        };
      }
      const n = B.exec(r);
      if (n)
        return {
          red: Number.parseInt(`${n[1]}`, 10),
          green: Number.parseInt(`${n[2]}`, 10),
          blue: Number.parseInt(`${n[3]}`, 10),
        };
      const o = ke.exec(r.substring(0, 50));
      if (o)
        return {
          red: Number.parseInt(`${o[1]}`, 10),
          green: Number.parseInt(`${o[2]}`, 10),
          blue: Number.parseInt(`${o[3]}`, 10),
          alpha:
            Number.parseFloat(`${o[4]}`) > 1
              ? Number.parseFloat(`${o[4]}`) / 100
              : Number.parseFloat(`${o[4]}`),
        };
      const s = Te.exec(r);
      if (s) {
        const i = Number.parseInt(`${s[1]}`, 10);
        const p = Number.parseInt(`${s[2]}`, 10) / 100;
        const l = Number.parseInt(`${s[3]}`, 10) / 100;
        const h = `rgb(${E(i, p, l)})`;
        const c = B.exec(h);
        if (!c) throw new b(4, r, h);
        return {
          red: Number.parseInt(`${c[1]}`, 10),
          green: Number.parseInt(`${c[2]}`, 10),
          blue: Number.parseInt(`${c[3]}`, 10),
        };
      }
      const f = we.exec(r.substring(0, 50));
      if (f) {
        const k = Number.parseInt(`${f[1]}`, 10);
        const pe = Number.parseInt(`${f[2]}`, 10) / 100;
        const le = Number.parseInt(`${f[3]}`, 10) / 100;
        const Y = `rgb(${E(k, pe, le)})`;
        const R = B.exec(Y);
        if (!R) throw new b(4, r, Y);
        return {
          red: Number.parseInt(`${R[1]}`, 10),
          green: Number.parseInt(`${R[2]}`, 10),
          blue: Number.parseInt(`${R[3]}`, 10),
          alpha:
            Number.parseFloat(`${f[4]}`) > 1
              ? Number.parseFloat(`${f[4]}`) / 100
              : Number.parseFloat(`${f[4]}`),
        };
      }
      throw new b(5);
    }
    function Pe(e) {
      const r = e.red / 255;
      const t = e.green / 255;
      const a = e.blue / 255;
      const n = Math.max(r, t, a);
      const o = Math.min(r, t, a);
      const s = (n + o) / 2;
      if (n === o)
        return e.alpha !== void 0
          ? { hue: 0, saturation: 0, lightness: s, alpha: e.alpha }
          : { hue: 0, saturation: 0, lightness: s };
      let i;
      const p = n - o;
      const l = s > 0.5 ? p / (2 - n - o) : p / (n + o);
      switch (n) {
        case r:
          i = (t - a) / p + (t < a ? 6 : 0);
          break;
        case t:
          i = (a - r) / p + 2;
          break;
        default:
          i = (r - t) / p + 4;
          break;
      }
      return (
        (i *= 60),
        e.alpha !== void 0
          ? { hue: i, saturation: l, lightness: s, alpha: e.alpha }
          : { hue: i, saturation: l, lightness: s }
      );
    }
    function g(e) {
      return Pe(S(e));
    }
    const Ce = (e) =>
      e.length === 7 && e[1] === e[2] && e[3] === e[4] && e[5] === e[6]
        ? `#${e[1]}${e[3]}${e[5]}`
        : e;
    const $ = Ce;
    function v(e) {
      const r = e.toString(16);
      return r.length === 1 ? `0${r}` : r;
    }
    function N(e) {
      return v(Math.round(e * 255));
    }
    function Ee(e, r, t) {
      return $(`#${N(e)}${N(r)}${N(t)}`);
    }
    function O(e, r, t) {
      return E(e, r, t, Ee);
    }
    function Re(e, r, t) {
      if (typeof e === 'number' && typeof r === 'number' && typeof t === 'number')
        return O(e, r, t);
      if (typeof e === 'object' && r === void 0 && t === void 0)
        return O(e.hue, e.saturation, e.lightness);
      throw new b(1);
    }
    function Ie(e, r, t, a) {
      if (
        typeof e === 'number' &&
        typeof r === 'number' &&
        typeof t === 'number' &&
        typeof a === 'number'
      )
        return a >= 1 ? O(e, r, t) : `rgba(${E(e, r, t)},${a})`;
      if (typeof e === 'object' && r === void 0 && t === void 0 && a === void 0)
        return e.alpha >= 1
          ? O(e.hue, e.saturation, e.lightness)
          : `rgba(${E(e.hue, e.saturation, e.lightness)},${e.alpha})`;
      throw new b(2);
    }
    function q(e, r, t) {
      if (typeof e === 'number' && typeof r === 'number' && typeof t === 'number')
        return $(`#${v(e)}${v(r)}${v(t)}`);
      if (typeof e === 'object' && r === void 0 && t === void 0)
        return $(`#${v(e.red)}${v(e.green)}${v(e.blue)}`);
      throw new b(6);
    }
    function F(e, r, t, a) {
      if (typeof e === 'string' && typeof r === 'number') {
        const n = S(e);
        return `rgba(${n.red},${n.green},${n.blue},${r})`;
      }
      if (
        typeof e === 'number' &&
        typeof r === 'number' &&
        typeof t === 'number' &&
        typeof a === 'number'
      )
        return a >= 1 ? q(e, r, t) : `rgba(${e},${r},${t},${a})`;
      if (typeof e === 'object' && r === void 0 && t === void 0 && a === void 0)
        return e.alpha >= 1
          ? q(e.red, e.green, e.blue)
          : `rgba(${e.red},${e.green},${e.blue},${e.alpha})`;
      throw new b(7);
    }
    const Oe = (e) =>
      typeof e.red === 'number' &&
      typeof e.green === 'number' &&
      typeof e.blue === 'number' &&
      (typeof e.alpha !== 'number' || typeof e.alpha > 'u');
    const Fe = (e) =>
      typeof e.red === 'number' &&
      typeof e.green === 'number' &&
      typeof e.blue === 'number' &&
      typeof e.alpha === 'number';
    const je = (e) =>
      typeof e.hue === 'number' &&
      typeof e.saturation === 'number' &&
      typeof e.lightness === 'number' &&
      (typeof e.alpha !== 'number' || typeof e.alpha > 'u');
    const He = (e) =>
      typeof e.hue === 'number' &&
      typeof e.saturation === 'number' &&
      typeof e.lightness === 'number' &&
      typeof e.alpha === 'number';
    function y(e) {
      if (typeof e !== 'object') throw new b(8);
      if (Fe(e)) return F(e);
      if (Oe(e)) return q(e);
      if (He(e)) return Ie(e);
      if (je(e)) return Re(e);
      throw new b(8);
    }
    function se(e, r, t) {
      return function () {
        const a = t.concat(Array.prototype.slice.call(arguments));
        return a.length >= r ? e.apply(this, a) : se(e, r, a);
      };
    }
    function m(e) {
      return se(e, e.length, []);
    }
    function ze(e, r) {
      if (r === 'transparent') return r;
      const t = g(r);
      return y(d({}, t, { hue: t.hue + Number.parseFloat(e) }));
    }
    m(ze);
    function _(e, r, t) {
      return Math.max(e, Math.min(r, t));
    }
    function Ae(e, r) {
      if (r === 'transparent') return r;
      const t = g(r);
      return y(d({}, t, { lightness: _(0, 1, t.lightness - Number.parseFloat(e)) }));
    }
    m(Ae);
    function Me(e, r) {
      if (r === 'transparent') return r;
      const t = g(r);
      return y(d({}, t, { saturation: _(0, 1, t.saturation - Number.parseFloat(e)) }));
    }
    m(Me);
    function Be(e, r) {
      if (r === 'transparent') return r;
      const t = g(r);
      return y(d({}, t, { lightness: _(0, 1, t.lightness + Number.parseFloat(e)) }));
    }
    m(Be);
    function Ne(e, r, t) {
      if (r === 'transparent') return t;
      if (t === 'transparent') return r;
      if (e === 0) return t;
      const a = S(r);
      const n = d({}, a, { alpha: typeof a.alpha === 'number' ? a.alpha : 1 });
      const o = S(t);
      const s = d({}, o, { alpha: typeof o.alpha === 'number' ? o.alpha : 1 });
      const i = n.alpha - s.alpha;
      const p = Number.parseFloat(e) * 2 - 1;
      const l = p * i === -1 ? p : p + i;
      const h = 1 + p * i;
      const c = (l / h + 1) / 2;
      const f = 1 - c;
      const k = {
        red: Math.floor(n.red * c + s.red * f),
        green: Math.floor(n.green * c + s.green * f),
        blue: Math.floor(n.blue * c + s.blue * f),
        alpha: n.alpha * Number.parseFloat(e) + s.alpha * (1 - Number.parseFloat(e)),
      };
      return F(k);
    }
    const Le = m(Ne);
    const ie = Le;
    function De(e, r) {
      if (r === 'transparent') return r;
      const t = S(r);
      const a = typeof t.alpha === 'number' ? t.alpha : 1;
      const n = d({}, t, { alpha: _(0, 1, (a * 100 + Number.parseFloat(e) * 100) / 100) });
      return F(n);
    }
    m(De);
    function $e(e, r) {
      if (r === 'transparent') return r;
      const t = g(r);
      return y(d({}, t, { saturation: _(0, 1, t.saturation + Number.parseFloat(e)) }));
    }
    m($e);
    function qe(e, r) {
      return r === 'transparent' ? r : y(d({}, g(r), { hue: Number.parseFloat(e) }));
    }
    m(qe);
    function We(e, r) {
      return r === 'transparent' ? r : y(d({}, g(r), { lightness: Number.parseFloat(e) }));
    }
    m(We);
    function Ye(e, r) {
      return r === 'transparent' ? r : y(d({}, g(r), { saturation: Number.parseFloat(e) }));
    }
    m(Ye);
    function Ge(e, r) {
      return r === 'transparent' ? r : ie(Number.parseFloat(e), 'rgb(0, 0, 0)', r);
    }
    m(Ge);
    function Ke(e, r) {
      return r === 'transparent' ? r : ie(Number.parseFloat(e), 'rgb(255, 255, 255)', r);
    }
    m(Ke);
    function Ue(e, r) {
      if (r === 'transparent') return r;
      const t = S(r);
      const a = typeof t.alpha === 'number' ? t.alpha : 1;
      const n = d({}, t, {
        alpha: _(0, 1, +(a * 100 - Number.parseFloat(e) * 100).toFixed(2) / 100),
      });
      return F(n);
    }
    const Ze = m(Ue);
    const Je = Ze;
    const Qe = x.div(J, ({ theme: e }) => ({
      backgroundColor: e.base === 'light' ? 'rgba(0,0,0,.01)' : 'rgba(255,255,255,.01)',
      borderRadius: e.appBorderRadius,
      border: `1px dashed ${e.appBorderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      margin: '25px 0 40px',
      color: Je(0.3, e.color.defaultText),
      fontSize: e.typography.size.s2,
    }));
    const Xe = (e) => u.createElement(Qe, { ...e, className: 'docblock-emptyblock sb-unstyled' });
    const Ve = x(Z)(({ theme: e }) => ({
      fontSize: `${e.typography.size.s2 - 1}px`,
      lineHeight: '19px',
      margin: '25px 0 40px',
      borderRadius: e.appBorderRadius,
      boxShadow:
        e.base === 'light' ? 'rgba(0, 0, 0, 0.10) 0 1px 3px 0' : 'rgba(0, 0, 0, 0.20) 0 2px 5px 0',
      'pre.prismjs': { padding: 20, background: 'inherit' },
    }));
    const er = x.div(({ theme: e }) => ({
      background: e.background.content,
      borderRadius: e.appBorderRadius,
      border: `1px solid ${e.appBorderColor}`,
      boxShadow:
        e.base === 'light' ? 'rgba(0, 0, 0, 0.10) 0 1px 3px 0' : 'rgba(0, 0, 0, 0.20) 0 2px 5px 0',
      margin: '25px 0 40px',
      padding: '20px 20px 20px 22px',
    }));
    const I = x.div(({ theme: e }) => ({
      animation: `${e.animation.glow} 1.5s ease-in-out infinite`,
      background: e.appBorderColor,
      height: 17,
      marginTop: 1,
      width: '60%',
      [`&:first-child${H}`]: { margin: 0 },
    }));
    const rr = () =>
      u.createElement(
        er,
        null,
        u.createElement(I, null),
        u.createElement(I, { style: { width: '80%' } }),
        u.createElement(I, { style: { width: '30%' } }),
        u.createElement(I, { style: { width: '80%' } })
      );
    const tr = ({
      isLoading: e,
      error: r,
      language: t,
      code: a,
      dark: n,
      format: o = !0,
      ...s
    }) => {
      const { typography: i } = A();
      if (e) return u.createElement(rr, null);
      if (r) return u.createElement(Xe, null, r);
      const p = u.createElement(
        Ve,
        {
          bordered: !0,
          copyable: !0,
          format: o,
          language: t ?? 'jsx',
          className: 'docblock-source sb-unstyled',
          ...s,
        },
        a
      );
      if (typeof n > 'u') return p;
      const l = n ? z.dark : z.light;
      return u.createElement(
        ee,
        { theme: re({ ...l, fontCode: i.fonts.mono, fontBase: i.fonts.base }) },
        p
      );
    };
    j.register(W, (e) => {
      j.add(ue, {
        title: 'Code',
        type: Q.PANEL,
        paramKey: te,
        disabled: (r) => !r?.docs?.codePanel,
        match: ({ viewMode: r }) => r === 'story',
        render: ({ active: r }) => {
          const t = e.getChannel();
          const a = e.getCurrentStoryData();
          const n = t?.last(ae)?.[0];
          const [o, s] = K({ source: n?.source, format: n?.format ?? void 0 });
          const i = V(te, { source: { code: '' }, theme: 'dark' });
          G(() => {
            s({ source: void 0, format: void 0 });
          }, [a?.id]),
            X({
              [ae]: ({ source: l, format: h }) => {
                s({ source: l, format: h });
              },
            });
          const p = A().base !== 'light';
          return u.createElement(
            U,
            { active: !!r },
            u.createElement(
              ar,
              null,
              u.createElement(tr, {
                ...i.source,
                code: i.source?.code || o.source || i.source?.originalSource,
                format: o.format,
                dark: p,
              })
            )
          );
        },
      });
    });
    const ar = x.div(() => ({
      height: '100%',
      [`> :first-child${H}`]: { margin: 0, height: '100%', boxShadow: 'none' },
    }));
  })();
} catch (e) {
  console.error(`[Storybook] One of your manager-entries failed: ${import.meta.url}`, e);
}
