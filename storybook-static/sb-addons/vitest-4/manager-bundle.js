try {
  (() => {
    var o = __REACT__,
      {
        Children: Dt,
        Component: Lt,
        Fragment: Ut,
        Profiler: Mt,
        PureComponent: Nt,
        StrictMode: Ht,
        Suspense: Ft,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Gt,
        act: $t,
        cloneElement: zt,
        createContext: Wt,
        createElement: Kt,
        createFactory: Yt,
        createRef: Vt,
        forwardRef: Zt,
        isValidElement: qt,
        lazy: Jt,
        memo: Qt,
        startTransition: Xt,
        unstable_act: eo,
        useCallback: D,
        useContext: V,
        useDebugValue: to,
        useDeferredValue: oo,
        useEffect: L,
        useId: no,
        useImperativeHandle: ro,
        useInsertionEffect: ao,
        useLayoutEffect: lo,
        useMemo: Z,
        useReducer: so,
        useRef: q,
        useState: R,
        useSyncExternalStore: co,
        useTransition: io,
        version: uo,
      } = __REACT__;
    var ho = __STORYBOOK_TYPES__,
      { Addon_TypesEnum: J } = __STORYBOOK_TYPES__;
    var So = __STORYBOOK_API__,
      {
        ActiveTabs: Eo,
        Consumer: To,
        ManagerContext: _o,
        Provider: Co,
        RequestResponseError: Ao,
        addons: k,
        combineParameters: wo,
        controlOrMetaKey: Oo,
        controlOrMetaSymbol: Ro,
        eventMatchesShortcut: ko,
        eventToShortcut: Po,
        experimental_MockUniversalStore: xo,
        experimental_UniversalStore: Q,
        experimental_getStatusStore: U,
        experimental_getTestProviderStore: X,
        experimental_requestResponse: Bo,
        experimental_useStatusStore: M,
        experimental_useTestProviderStore: ee,
        experimental_useUniversalStore: te,
        internal_fullStatusStore: jo,
        internal_fullTestProviderStore: Do,
        internal_universalStatusStore: Lo,
        internal_universalTestProviderStore: Uo,
        isMacLike: Mo,
        isShortcutTaken: No,
        keyToSymbol: Ho,
        merge: Fo,
        mockChannel: Go,
        optionOrAltSymbol: $o,
        shortcutMatchesShortcut: zo,
        shortcutToHumanString: Wo,
        types: Ko,
        useAddonState: Yo,
        useArgTypes: Vo,
        useArgs: Zo,
        useChannel: qo,
        useGlobalTypes: Jo,
        useGlobals: Qo,
        useParameter: Xo,
        useSharedState: en,
        useStoryPrepared: tn,
        useStorybookApi: oe,
        useStorybookState: on,
      } = __STORYBOOK_API__;
    var sn = __STORYBOOK_COMPONENTS__,
      {
        A: cn,
        ActionBar: un,
        AddonPanel: dn,
        Badge: mn,
        Bar: gn,
        Blockquote: pn,
        Button: N,
        Checkbox: P,
        ClipboardCode: In,
        Code: hn,
        DL: fn,
        Div: yn,
        DocumentWrapper: bn,
        EmptyTabContent: vn,
        ErrorFormatter: Sn,
        FlexBar: En,
        Form: Tn,
        H1: _n,
        H2: Cn,
        H3: An,
        H4: wn,
        H5: On,
        H6: Rn,
        HR: kn,
        IconButton: f,
        Img: Pn,
        LI: xn,
        Link: H,
        ListItem: x,
        Loader: Bn,
        Modal: F,
        OL: jn,
        P: Dn,
        Placeholder: Ln,
        Pre: Un,
        ProgressSpinner: ne,
        ResetWrapper: Mn,
        ScrollArea: Nn,
        Separator: Hn,
        Spaced: Fn,
        Span: Gn,
        StorybookIcon: $n,
        StorybookLogo: zn,
        SyntaxHighlighter: Wn,
        TT: Kn,
        TabBar: Yn,
        TabButton: Vn,
        TabWrapper: Zn,
        Table: qn,
        Tabs: Jn,
        TabsState: Qn,
        TooltipLinkList: Xn,
        TooltipMessage: er,
        TooltipNote: E,
        UL: tr,
        WithTooltip: T,
        WithTooltipPure: or,
        Zoom: nr,
        codeCommon: rr,
        components: ar,
        createCopyToClipboardFunction: lr,
        getStoryHref: sr,
        interleaveSeparators: cr,
        nameSpaceClassNames: ir,
        resetComponents: ur,
        withReset: dr,
      } = __STORYBOOK_COMPONENTS__;
    var hr = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: fr,
        AccessibilityIcon: yr,
        AccessibilityIgnoredIcon: br,
        AddIcon: vr,
        AdminIcon: Sr,
        AlertAltIcon: Er,
        AlertIcon: Tr,
        AlignLeftIcon: _r,
        AlignRightIcon: Cr,
        AppleIcon: Ar,
        ArrowBottomLeftIcon: wr,
        ArrowBottomRightIcon: Or,
        ArrowDownIcon: Rr,
        ArrowLeftIcon: kr,
        ArrowRightIcon: Pr,
        ArrowSolidDownIcon: xr,
        ArrowSolidLeftIcon: Br,
        ArrowSolidRightIcon: jr,
        ArrowSolidUpIcon: Dr,
        ArrowTopLeftIcon: Lr,
        ArrowTopRightIcon: Ur,
        ArrowUpIcon: Mr,
        AzureDevOpsIcon: Nr,
        BackIcon: Hr,
        BasketIcon: Fr,
        BatchAcceptIcon: Gr,
        BatchDenyIcon: $r,
        BeakerIcon: zr,
        BellIcon: Wr,
        BitbucketIcon: Kr,
        BoldIcon: Yr,
        BookIcon: Vr,
        BookmarkHollowIcon: Zr,
        BookmarkIcon: qr,
        BottomBarIcon: Jr,
        BottomBarToggleIcon: Qr,
        BoxIcon: Xr,
        BranchIcon: ea,
        BrowserIcon: ta,
        ButtonIcon: oa,
        CPUIcon: na,
        CalendarIcon: ra,
        CameraIcon: aa,
        CameraStabilizeIcon: la,
        CategoryIcon: sa,
        CertificateIcon: ca,
        ChangedIcon: ia,
        ChatIcon: ua,
        CheckIcon: da,
        ChevronDownIcon: ma,
        ChevronLeftIcon: ga,
        ChevronRightIcon: pa,
        ChevronSmallDownIcon: Ia,
        ChevronSmallLeftIcon: ha,
        ChevronSmallRightIcon: fa,
        ChevronSmallUpIcon: ya,
        ChevronUpIcon: ba,
        ChromaticIcon: va,
        ChromeIcon: Sa,
        CircleHollowIcon: Ea,
        CircleIcon: Ta,
        ClearIcon: _a,
        CloseAltIcon: Ca,
        CloseIcon: re,
        CloudHollowIcon: Aa,
        CloudIcon: wa,
        CogIcon: Oa,
        CollapseIcon: Ra,
        CommandIcon: ka,
        CommentAddIcon: Pa,
        CommentIcon: xa,
        CommentsIcon: Ba,
        CommitIcon: ja,
        CompassIcon: Da,
        ComponentDrivenIcon: La,
        ComponentIcon: Ua,
        ContrastIcon: Ma,
        ContrastIgnoredIcon: Na,
        ControlsIcon: Ha,
        CopyIcon: Fa,
        CreditIcon: Ga,
        CrossIcon: $a,
        DashboardIcon: za,
        DatabaseIcon: Wa,
        DeleteIcon: Ka,
        DiamondIcon: Ya,
        DirectionIcon: Va,
        DiscordIcon: Za,
        DocChartIcon: qa,
        DocListIcon: Ja,
        DocumentIcon: Qa,
        DownloadIcon: Xa,
        DragIcon: el,
        EditIcon: tl,
        EllipsisIcon: ol,
        EmailIcon: nl,
        ExpandAltIcon: rl,
        ExpandIcon: al,
        EyeCloseIcon: ll,
        EyeIcon: ae,
        FaceHappyIcon: sl,
        FaceNeutralIcon: cl,
        FaceSadIcon: il,
        FacebookIcon: ul,
        FailedIcon: dl,
        FastForwardIcon: ml,
        FigmaIcon: gl,
        FilterIcon: pl,
        FlagIcon: Il,
        FolderIcon: hl,
        FormIcon: fl,
        GDriveIcon: yl,
        GithubIcon: bl,
        GitlabIcon: vl,
        GlobeIcon: Sl,
        GoogleIcon: El,
        GraphBarIcon: Tl,
        GraphLineIcon: _l,
        GraphqlIcon: Cl,
        GridAltIcon: Al,
        GridIcon: wl,
        GrowIcon: Ol,
        HeartHollowIcon: Rl,
        HeartIcon: kl,
        HomeIcon: Pl,
        HourglassIcon: xl,
        InfoIcon: le,
        ItalicIcon: Bl,
        JumpToIcon: jl,
        KeyIcon: Dl,
        LightningIcon: Ll,
        LightningOffIcon: Ul,
        LinkBrokenIcon: Ml,
        LinkIcon: Nl,
        LinkedinIcon: Hl,
        LinuxIcon: Fl,
        ListOrderedIcon: Gl,
        ListUnorderedIcon: $l,
        LocationIcon: zl,
        LockIcon: Wl,
        MarkdownIcon: Kl,
        MarkupIcon: Yl,
        MediumIcon: Vl,
        MemoryIcon: Zl,
        MenuIcon: ql,
        MergeIcon: Jl,
        MirrorIcon: Ql,
        MobileIcon: Xl,
        MoonIcon: es,
        NutIcon: ts,
        OutboxIcon: os,
        OutlineIcon: ns,
        PaintBrushIcon: rs,
        PaperClipIcon: as,
        ParagraphIcon: ls,
        PassedIcon: ss,
        PhoneIcon: cs,
        PhotoDragIcon: is,
        PhotoIcon: us,
        PhotoStabilizeIcon: ds,
        PinAltIcon: ms,
        PinIcon: gs,
        PlayAllHollowIcon: ps,
        PlayBackIcon: Is,
        PlayHollowIcon: se,
        PlayIcon: hs,
        PlayNextIcon: fs,
        PlusIcon: ys,
        PointerDefaultIcon: bs,
        PointerHandIcon: vs,
        PowerIcon: Ss,
        PrintIcon: Es,
        ProceedIcon: Ts,
        ProfileIcon: _s,
        PullRequestIcon: Cs,
        QuestionIcon: As,
        RSSIcon: ws,
        RedirectIcon: Os,
        ReduxIcon: Rs,
        RefreshIcon: ks,
        ReplyIcon: Ps,
        RepoIcon: xs,
        RequestChangeIcon: Bs,
        RewindIcon: js,
        RulerIcon: Ds,
        SaveIcon: Ls,
        SearchIcon: Us,
        ShareAltIcon: Ms,
        ShareIcon: Ns,
        ShieldIcon: Hs,
        SideBySideIcon: Fs,
        SidebarAltIcon: Gs,
        SidebarAltToggleIcon: $s,
        SidebarIcon: zs,
        SidebarToggleIcon: Ws,
        SpeakerIcon: Ks,
        StackedIcon: Ys,
        StarHollowIcon: Vs,
        StarIcon: Zs,
        StatusFailIcon: qs,
        StatusIcon: Js,
        StatusPassIcon: Qs,
        StatusWarnIcon: Xs,
        StickerIcon: ec,
        StopAltHollowIcon: tc,
        StopAltIcon: ce,
        StopIcon: oc,
        StorybookIcon: nc,
        StructureIcon: rc,
        SubtractIcon: ac,
        SunIcon: lc,
        SupportIcon: sc,
        SweepIcon: cc,
        SwitchAltIcon: ic,
        SyncIcon: ie,
        TabletIcon: uc,
        ThumbsUpIcon: dc,
        TimeIcon: mc,
        TimerIcon: gc,
        TransferIcon: pc,
        TrashIcon: Ic,
        TwitterIcon: hc,
        TypeIcon: fc,
        UbuntuIcon: yc,
        UndoIcon: bc,
        UnfoldIcon: vc,
        UnlockIcon: Sc,
        UnpinIcon: Ec,
        UploadIcon: Tc,
        UserAddIcon: _c,
        UserAltIcon: Cc,
        UserIcon: Ac,
        UsersIcon: wc,
        VSCodeIcon: Oc,
        VerifiedIcon: Rc,
        VideoIcon: kc,
        WandIcon: Pc,
        WatchIcon: xc,
        WindowsIcon: Bc,
        WrenchIcon: jc,
        XIcon: Dc,
        YoutubeIcon: Lc,
        ZoomIcon: Uc,
        ZoomOutIcon: Mc,
        ZoomResetIcon: Nc,
        iconList: Hc,
      } = __STORYBOOK_ICONS__;
    var Wc = __STORYBOOK_THEMING__,
      {
        CacheProvider: Kc,
        ClassNames: Yc,
        Global: Vc,
        ThemeProvider: Zc,
        background: qc,
        color: Jc,
        convert: Qc,
        create: Xc,
        createCache: ei,
        createGlobal: ti,
        createReset: oi,
        css: ni,
        darken: ri,
        ensure: ai,
        ignoreSsrWarning: li,
        isPropValid: si,
        jsx: ci,
        keyframes: ii,
        lighten: ui,
        styled: p,
        themes: di,
        typography: mi,
        useTheme: gi,
        withTheme: pi,
      } = __STORYBOOK_THEMING__;
    var Re = 'storybook/interactions',
      ye = `${Re}/panel`,
      be = 'storybook/a11y',
      ve = `${be}/panel`,
      O = 'storybook/test',
      ke = `${O}/test-provider`,
      Pe = 'writing-tests/integrations/vitest-addon',
      xe = `${Pe}#what-happens-if-vitest-itself-has-an-error`,
      Be = {
        id: O,
        initialState: {
          config: { coverage: !1, a11y: !1 },
          watching: !1,
          cancelling: !1,
          fatalError: void 0,
          indexUrl: void 0,
          previewAnnotations: [],
          currentRun: {
            triggeredBy: void 0,
            config: { coverage: !1, a11y: !1 },
            componentTestCount: { success: 0, error: 0 },
            a11yCount: { success: 0, warning: 0, error: 0 },
            storyIds: void 0,
            totalTestCount: void 0,
            startedAt: void 0,
            finishedAt: void 0,
            unhandledErrors: [],
            coverageSummary: void 0,
          },
        },
      },
      ue = ['global', 'run-all'],
      Se = 'storybook/component-test',
      Ee = 'storybook/a11y',
      y = Q.create({ ...Be, leader: globalThis.CONFIG_TYPE === 'PRODUCTION' }),
      je = U(Se),
      De = U(Ee),
      Te = X(O),
      Le = p.div({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 6px 6px 20px',
      }),
      Ue = p.div({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }),
      Me = p(F.Title)(({ theme: { typography: e } }) => ({
        fontSize: e.size.s2,
        fontWeight: e.weight.bold,
      })),
      Ne = p.pre(({ theme: e }) => ({
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        overflow: 'auto',
        maxHeight: '60vh',
        margin: 0,
        padding: '20px',
        fontFamily: e.typography.fonts.mono,
        fontSize: '12px',
        borderTop: `1px solid ${e.appBorderColor}`,
        borderRadius: 0,
      })),
      He = p.a(({ theme: e }) => ({ color: e.color.defaultText })),
      W = o.createContext({ isModalOpen: !1, setModalOpen: void 0 });
    function z({ error: e }) {
      return e
        ? o.createElement(
            'div',
            null,
            o.createElement('h4', null, 'Caused by: ', e.name || 'Error', ': ', e.message),
            e.stack && o.createElement('pre', null, e.stack),
            e.cause && o.createElement(z, { error: e.cause })
          )
        : null;
    }
    function Fe({ onRerun: e, storeState: t }) {
      const n = oe(),
        { isModalOpen: s, setModalOpen: u } = V(W),
        r = () => u?.(!1),
        l = n.getDocsUrl({ subpath: xe, versioned: !0, renderer: !0 }),
        {
          fatalError: i,
          currentRun: { unhandledErrors: c },
        } = t,
        g = i
          ? o.createElement(
              o.Fragment,
              null,
              o.createElement('p', null, i.error.name || 'Error'),
              i.message && o.createElement('p', null, i.message),
              i.error.message && o.createElement('p', null, i.error.message),
              i.error.stack && o.createElement('p', null, i.error.stack),
              i.error.cause && o.createElement(z, { error: i.error.cause })
            )
          : c.length > 0
            ? o.createElement(
                'ol',
                null,
                c.map((a) =>
                  o.createElement(
                    'li',
                    { key: a.name + a.message },
                    o.createElement('p', null, a.name, ': ', a.message),
                    a.VITEST_TEST_PATH &&
                      o.createElement(
                        'p',
                        null,
                        'This error originated in "',
                        o.createElement('b', null, a.VITEST_TEST_PATH),
                        `". It doesn't mean the error was thrown inside the file itself, but while it was running.`
                      ),
                    a.VITEST_TEST_NAME &&
                      o.createElement(
                        o.Fragment,
                        null,
                        o.createElement(
                          'p',
                          null,
                          `The latest test that might've caused the error is "`,
                          o.createElement('b', null, a.VITEST_TEST_NAME),
                          '". It might mean one of the following:'
                        ),
                        o.createElement(
                          'ul',
                          null,
                          o.createElement(
                            'li',
                            null,
                            'The error was thrown, while Vitest was running this test.'
                          ),
                          o.createElement(
                            'li',
                            null,
                            'If the error occurred after the test had been completed, this was the last documented test before it was thrown.'
                          )
                        )
                      ),
                    a.stacks &&
                      o.createElement(
                        o.Fragment,
                        null,
                        o.createElement('p', null, o.createElement('b', null, 'Stacks:')),
                        o.createElement(
                          'ul',
                          null,
                          a.stacks.map((d) =>
                            o.createElement(
                              'li',
                              { key: d.file + d.line + d.column },
                              d.file,
                              ':',
                              d.line,
                              ':',
                              d.column,
                              ' - ',
                              d.method || 'unknown method'
                            )
                          )
                        )
                      ),
                    a.stack && o.createElement('p', null, a.stack),
                    a.cause ? o.createElement(z, { error: a.cause }) : null
                  )
                )
              )
            : null;
      return o.createElement(
        F,
        { onEscapeKeyDown: r, onInteractOutside: r, open: s },
        o.createElement(
          Le,
          null,
          o.createElement(Me, null, 'Storybook Tests error details'),
          o.createElement(
            Ue,
            null,
            o.createElement(
              N,
              { onClick: e, variant: 'ghost' },
              o.createElement(ie, null),
              'Rerun'
            ),
            o.createElement(
              N,
              { variant: 'ghost', asChild: !0 },
              o.createElement('a', { target: '_blank', href: l, rel: 'noreferrer' }, 'Troubleshoot')
            ),
            o.createElement(
              f,
              { onClick: r, 'aria-label': 'Close modal' },
              o.createElement(re, null)
            )
          )
        ),
        o.createElement(
          Ne,
          null,
          g,
          o.createElement('br', null),
          o.createElement('br', null),
          'Troubleshoot:',
          ' ',
          o.createElement(He, { target: '_blank', href: l }, l)
        )
      );
    }
    function Ge() {}
    function de(e) {
      return Object.getOwnPropertySymbols(e).filter((t) =>
        Object.prototype.propertyIsEnumerable.call(e, t)
      );
    }
    function me(e) {
      return e == null
        ? e === void 0
          ? '[object Undefined]'
          : '[object Null]'
        : Object.prototype.toString.call(e);
    }
    var $e = '[object RegExp]',
      ze = '[object String]',
      We = '[object Number]',
      Ke = '[object Boolean]',
      ge = '[object Arguments]',
      Ye = '[object Symbol]',
      Ve = '[object Date]',
      Ze = '[object Map]',
      qe = '[object Set]',
      Je = '[object Array]',
      Qe = '[object Function]',
      Xe = '[object ArrayBuffer]',
      G = '[object Object]',
      et = '[object Error]',
      tt = '[object DataView]',
      ot = '[object Uint8Array]',
      nt = '[object Uint8ClampedArray]',
      rt = '[object Uint16Array]',
      at = '[object Uint32Array]',
      lt = '[object BigUint64Array]',
      st = '[object Int8Array]',
      ct = '[object Int16Array]',
      it = '[object Int32Array]',
      ut = '[object BigInt64Array]',
      dt = '[object Float32Array]',
      mt = '[object Float64Array]';
    function pe(e) {
      if (!e || typeof e != 'object') return !1;
      const t = Object.getPrototypeOf(e);
      return t === null || t === Object.prototype || Object.getPrototypeOf(t) === null
        ? Object.prototype.toString.call(e) === '[object Object]'
        : !1;
    }
    function gt(e, t) {
      return e === t || (Number.isNaN(e) && Number.isNaN(t));
    }
    function pt(e, t, n) {
      return A(e, t, void 0, void 0, void 0, void 0, n);
    }
    function A(e, t, n, s, u, r, l) {
      const i = l(e, t, n, s, u, r);
      if (i !== void 0) return i;
      if (typeof e == typeof t)
        switch (typeof e) {
          case 'bigint':
          case 'string':
          case 'boolean':
          case 'symbol':
          case 'undefined':
            return e === t;
          case 'number':
            return e === t || Object.is(e, t);
          case 'function':
            return e === t;
          case 'object':
            return w(e, t, r, l);
        }
      return w(e, t, r, l);
    }
    function w(e, t, n, s) {
      if (Object.is(e, t)) return !0;
      let u = me(e),
        r = me(t);
      if ((u === ge && (u = G), r === ge && (r = G), u !== r)) return !1;
      switch (u) {
        case ze:
          return e.toString() === t.toString();
        case We: {
          const c = e.valueOf(),
            g = t.valueOf();
          return gt(c, g);
        }
        case Ke:
        case Ve:
        case Ye:
          return Object.is(e.valueOf(), t.valueOf());
        case $e:
          return e.source === t.source && e.flags === t.flags;
        case Qe:
          return e === t;
      }
      n = n ?? new Map();
      const l = n.get(e),
        i = n.get(t);
      if (l != null && i != null) return l === t;
      n.set(e, t), n.set(t, e);
      try {
        switch (u) {
          case Ze: {
            if (e.size !== t.size) return !1;
            for (const [c, g] of e.entries())
              if (!t.has(c) || !A(g, t.get(c), c, e, t, n, s)) return !1;
            return !0;
          }
          case qe: {
            if (e.size !== t.size) return !1;
            const c = Array.from(e.values()),
              g = Array.from(t.values());
            for (let a = 0; a < c.length; a++) {
              const d = c[a],
                m = g.findIndex((I) => A(d, I, void 0, e, t, n, s));
              if (m === -1) return !1;
              g.splice(m, 1);
            }
            return !0;
          }
          case Je:
          case ot:
          case nt:
          case rt:
          case at:
          case lt:
          case st:
          case ct:
          case it:
          case ut:
          case dt:
          case mt: {
            if (
              (typeof Buffer < 'u' && Buffer.isBuffer(e) !== Buffer.isBuffer(t)) ||
              e.length !== t.length
            )
              return !1;
            for (let c = 0; c < e.length; c++) if (!A(e[c], t[c], c, e, t, n, s)) return !1;
            return !0;
          }
          case Xe:
            return e.byteLength !== t.byteLength
              ? !1
              : w(new Uint8Array(e), new Uint8Array(t), n, s);
          case tt:
            return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset
              ? !1
              : w(new Uint8Array(e), new Uint8Array(t), n, s);
          case et:
            return e.name === t.name && e.message === t.message;
          case G: {
            if (!(w(e.constructor, t.constructor, n, s) || (pe(e) && pe(t)))) return !1;
            const c = [...Object.keys(e), ...de(e)],
              g = [...Object.keys(t), ...de(t)];
            if (c.length !== g.length) return !1;
            for (let a = 0; a < c.length; a++) {
              const d = c[a],
                m = e[d];
              if (!Object.hasOwn(t, d)) return !1;
              const I = t[d];
              if (!A(m, I, d, e, t, n, s)) return !1;
            }
            return !0;
          }
          default:
            return !1;
        }
      } finally {
        n.delete(e), n.delete(t);
      }
    }
    function It(e, t) {
      return pt(e, t, Ge);
    }
    var Ie = (e, t, n) => {
        const s = {
          'status-value:pending': [],
          'status-value:success': [],
          'status-value:error': [],
          'status-value:warning': [],
          'status-value:unknown': [],
        };
        return (
          (n ? n.map((u) => e[u]).filter(Boolean) : Object.values(e)).forEach((u) => {
            const r = u[t];
            r && s[r.value].push(r.storyId);
          }),
          s
        );
      },
      _e = (e, t) => {
        const n = ee((I) => I[O]),
          [s, u] = te(y),
          [r, l] = R(!1),
          i = q();
        L(() => {
          const I = y.onStateChange((_, j) => {
            It(_.config, j.config) ||
              (Te.settingsChanged(),
              l(!0),
              clearTimeout(i.current),
              (i.current = setTimeout(() => {
                l(!1);
              }, 1e3)));
          });
          return () => {
            I(), clearTimeout(i.current);
          };
        }, []);
        const c = Z(() => (t ? e.findAllLeafStoryIds(t) : void 0), [t, e]),
          g = D((I) => Ie(I, Se, c), [c]),
          a = M(g),
          d = D((I) => Ie(I, Ee, c), [c]),
          m = M(d);
        return {
          storeState: s,
          setStoreState: u,
          testProviderState: n,
          componentTestStatusValueToStoryIds: a,
          a11yStatusValueToStoryIds: m,
          isSettingsUpdated: r,
        };
      },
      ht = ({ timestamp: e }) => {
        const [t, n] = R(null);
        if (
          (L(() => {
            if (e) {
              n(Date.now() - e);
              const i = setInterval(() => n(Date.now() - e), 1e4);
              return () => clearInterval(i);
            }
          }, [e]),
          t === null)
        )
          return null;
        const s = Math.round(t / 1e3);
        if (s < 60) return 'just now';
        const u = Math.floor(s / 60);
        if (u < 60) return u === 1 ? 'a minute ago' : `${u} minutes ago`;
        const r = Math.floor(u / 60);
        if (r < 24) return r === 1 ? 'an hour ago' : `${r} hours ago`;
        const l = Math.floor(r / 24);
        return l === 1 ? 'yesterday' : `${l} days ago`;
      },
      ft = p.div(({ theme: e }) => ({
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: e.typography.size.s1,
        color: e.textMutedColor,
      })),
      yt = p.span(({ theme: e }) => ({ color: e.color.positiveText }));
    function bt({ entryId: e, storeState: t, testProviderState: n, isSettingsUpdated: s, ...u }) {
      let { setModalOpen: r } = o.useContext(W),
        {
          componentTestCount: l,
          totalTestCount: i,
          unhandledErrors: c,
          finishedAt: g,
        } = t.currentRun,
        a = l.success + l.error,
        d = 'Not run';
      if (!e && s) d = o.createElement(yt, null, 'Settings updated');
      else if (n === 'test-provider-state:running')
        d = (a ?? 0) === 0 ? 'Starting...' : `Testing... ${a}/${i}`;
      else if (!e && n === 'test-provider-state:crashed')
        d = r
          ? o.createElement(H, { isButton: !0, onClick: () => r(!0) }, 'View full error')
          : 'Crashed';
      else if (!e && c.length > 0) {
        const m = `View ${c.length} unhandled error${c?.length > 1 ? 's' : ''}`;
        d = r ? o.createElement(H, { isButton: !0, onClick: () => r(!0) }, m) : m;
      } else
        e && i
          ? (d = `Ran ${i} ${i === 1 ? 'test' : 'tests'}`)
          : g
            ? (d = o.createElement(
                o.Fragment,
                null,
                'Ran ',
                i,
                ' ',
                i === 1 ? 'test' : 'tests',
                ' ',
                o.createElement(ht, { timestamp: g })
              ))
            : t.watching && (d = 'Watching for file changes');
      return o.createElement(ft, { ...u }, d);
    }
    var B = p.div(
        ({ percentage: e }) => ({
          width: e ? 12 : 6,
          height: e ? 12 : 6,
          margin: e ? 1 : 4,
          background: e
            ? `conic-gradient(var(--status-color) ${e}%, var(--status-background) ${e + 1}%)`
            : 'var(--status-color)',
          borderRadius: '50%',
        }),
        ({ isRunning: e, theme: t }) =>
          e && { animation: `${t.animation.glow} 1.5s ease-in-out infinite` },
        ({ status: e, theme: t }) =>
          e === 'positive' && {
            '--status-color': t.color.positive,
            '--status-background': `${t.color.positive}66`,
          },
        ({ status: e, theme: t }) =>
          e === 'warning' && {
            '--status-color': t.color.gold,
            '--status-background': `${t.color.gold}66`,
          },
        ({ status: e, theme: t }) =>
          e === 'negative' && {
            '--status-color': t.color.negative,
            '--status-background': `${t.color.negative}66`,
          },
        ({ status: e, theme: t }) =>
          e === 'critical' && {
            '--status-color': t.color.defaultText,
            '--status-background': `${t.color.defaultText}66`,
          },
        ({ status: e, theme: t }) =>
          e === 'unknown' && {
            '--status-color': t.color.mediumdark,
            '--status-background': `${t.color.mediumdark}66`,
          }
      ),
      vt = p.div({ display: 'flex', flexDirection: 'column' }),
      St = p.div({ display: 'flex', justifyContent: 'space-between', padding: '8px 0', gap: 12 }),
      Et = p.div({ display: 'flex', flexDirection: 'column', marginLeft: 8, minWidth: 0 }),
      he = p.div(({ crashed: e, theme: t }) => ({
        fontSize: t.typography.size.s1,
        fontWeight: e ? 'bold' : 'normal',
        color: e ? t.color.negativeText : t.color.defaultText,
      })),
      Tt = p.div({ display: 'flex', gap: 4 }),
      _t = p.div({ marginBottom: 2 }),
      Ct = p.span(({ theme: e }) => ({ color: e.textMutedColor })),
      At = p(ne)({ margin: 4 }),
      $ = p.div({ display: 'flex', gap: 4 }),
      wt = p(ce)({ width: 10 }),
      fe = ({ api: e, panelId: t, entryId: n }) => {
        const s = n ? e.findAllLeafStoryIds(n)[0] : void 0;
        s && e.selectStory(s), e.setSelectedPanel(t), e.togglePanel(!0);
      },
      Ce = ({
        api: e,
        entry: t,
        testProviderState: n,
        storeState: s,
        setStoreState: u,
        componentTestStatusValueToStoryIds: r,
        a11yStatusValueToStoryIds: l,
        isSettingsUpdated: i,
        ...c
      }) => {
        const { config: g, watching: a, cancelling: d, currentRun: m, fatalError: I } = s,
          _ = m.componentTestCount.success + m.componentTestCount.error,
          j = k.experimental_getRegisteredAddons().includes(be),
          h = n === 'test-provider-state:running',
          Ae = h && _ === 0,
          [we, K] = I
            ? ['critical', 'Component tests crashed']
            : r['status-value:error'].length > 0
              ? ['negative', 'Component tests failed']
              : h
                ? ['unknown', 'Testing in progress']
                : r['status-value:success'].length > 0
                  ? ['positive', 'Component tests passed']
                  : ['unknown', 'Run tests to see results'],
          [Oe, Y] = I
            ? ['critical', 'Component tests crashed']
            : l['status-value:error'].length > 0
              ? ['negative', 'Accessibility tests failed']
              : l['status-value:warning'].length > 0
                ? ['warning', 'Accessibility tests failed']
                : h
                  ? ['unknown', 'Testing in progress']
                  : l['status-value:success'].length > 0
                    ? ['positive', 'Accessibility tests passed']
                    : ['unknown', 'Run tests to see accessibility results'];
        return o.createElement(
          vt,
          { ...c },
          o.createElement(
            St,
            null,
            o.createElement(
              Et,
              null,
              t
                ? o.createElement(he, { id: 'testing-module-title' }, 'Run component tests')
                : o.createElement(
                    he,
                    {
                      id: 'testing-module-title',
                      crashed:
                        n === 'test-provider-state:crashed' ||
                        I !== void 0 ||
                        m.unhandledErrors.length > 0,
                    },
                    m.unhandledErrors.length === 1
                      ? 'Component tests completed with an error'
                      : m.unhandledErrors.length > 1
                        ? 'Component tests completed with errors'
                        : I
                          ? 'Component tests didn\u2019t complete'
                          : 'Run component tests'
                  ),
              o.createElement(bt, {
                id: 'testing-module-description',
                storeState: s,
                testProviderState: n,
                entryId: t?.id,
                isSettingsUpdated: i,
              })
            ),
            o.createElement(
              Tt,
              null,
              !t &&
                o.createElement(
                  T,
                  {
                    hasChrome: !1,
                    trigger: 'hover',
                    tooltip: o.createElement(E, { note: `${a ? 'Disable' : 'Enable'} watch mode` }),
                  },
                  o.createElement(
                    f,
                    {
                      'aria-label': `${a ? 'Disable' : 'Enable'} watch mode`,
                      size: 'medium',
                      active: a,
                      onClick: () => y.send({ type: 'TOGGLE_WATCHING', payload: { to: !a } }),
                      disabled: h,
                    },
                    o.createElement(ae, null)
                  )
                ),
              h
                ? o.createElement(
                    T,
                    {
                      hasChrome: !1,
                      trigger: 'hover',
                      tooltip: o.createElement(E, { note: d ? 'Stopping...' : 'Stop test run' }),
                    },
                    o.createElement(
                      f,
                      {
                        'aria-label': d ? 'Stopping...' : 'Stop test run',
                        padding: 'none',
                        size: 'medium',
                        onClick: () => y.send({ type: 'CANCEL_RUN' }),
                        disabled: d || Ae,
                      },
                      o.createElement(
                        At,
                        {
                          percentage:
                            _ && s.currentRun.totalTestCount
                              ? (_ / s.currentRun.totalTestCount) * 100
                              : void 0,
                        },
                        o.createElement(wt, null)
                      )
                    )
                  )
                : o.createElement(
                    T,
                    {
                      hasChrome: !1,
                      trigger: 'hover',
                      tooltip: o.createElement(E, { note: 'Start test run' }),
                    },
                    o.createElement(
                      f,
                      {
                        'aria-label': 'Start test run',
                        size: 'medium',
                        onClick: () =>
                          y.send({
                            type: 'TRIGGER_RUN',
                            payload: {
                              storyIds: t ? e.findAllLeafStoryIds(t.id) : void 0,
                              triggeredBy: t ? t.type : 'global',
                            },
                          }),
                      },
                      o.createElement(se, null)
                    )
                  )
            )
          ),
          o.createElement(
            _t,
            null,
            o.createElement(
              $,
              null,
              o.createElement(x, {
                as: 'label',
                title: 'Interactions',
                icon: t ? null : o.createElement(P, { checked: !0, disabled: !0 }),
              }),
              o.createElement(
                T,
                { hasChrome: !1, trigger: 'hover', tooltip: o.createElement(E, { note: K }) },
                o.createElement(
                  f,
                  {
                    size: 'medium',
                    disabled:
                      r['status-value:error'].length === 0 &&
                      r['status-value:warning'].length === 0 &&
                      r['status-value:success'].length === 0,
                    onClick: () => {
                      fe({
                        api: e,
                        panelId: ye,
                        entryId:
                          r['status-value:error'][0] ??
                          r['status-value:warning'][0] ??
                          r['status-value:success'][0] ??
                          t?.id,
                      });
                    },
                  },
                  o.createElement(B, { status: we, 'aria-label': K, isRunning: h }),
                  r['status-value:error'].length + r['status-value:warning'].length || null
                )
              )
            ),
            !t &&
              o.createElement(
                $,
                null,
                o.createElement(x, {
                  as: 'label',
                  title: a ? o.createElement(Ct, null, 'Coverage (unavailable)') : 'Coverage',
                  icon: o.createElement(P, {
                    checked: g.coverage,
                    disabled: h,
                    onChange: () =>
                      u((C) => ({ ...C, config: { ...C.config, coverage: !g.coverage } })),
                  }),
                }),
                o.createElement(
                  T,
                  {
                    hasChrome: !1,
                    trigger: 'hover',
                    tooltip: o.createElement(E, {
                      note: a
                        ? 'Unavailable in watch mode'
                        : m.triggeredBy && !ue.includes(m.triggeredBy)
                          ? 'Unavailable when running focused tests'
                          : h
                            ? 'Testing in progress'
                            : m.coverageSummary
                              ? 'View coverage report'
                              : I
                                ? 'Component tests crashed'
                                : 'Run tests to calculate coverage',
                    }),
                  },
                  a || (m.triggeredBy && !ue.includes(m.triggeredBy))
                    ? o.createElement(
                        f,
                        { size: 'medium', disabled: !0 },
                        o.createElement(le, {
                          'aria-label': a
                            ? 'Coverage is unavailable in watch mode'
                            : 'Coverage is unavailable when running focused tests',
                        })
                      )
                    : m.coverageSummary
                      ? o.createElement(
                          f,
                          { asChild: !0, size: 'medium' },
                          o.createElement(
                            'a',
                            {
                              href: '/coverage/index.html',
                              target: '_blank',
                              'aria-label': 'Open coverage report',
                            },
                            o.createElement(B, {
                              isRunning: h,
                              percentage: m.coverageSummary.percentage,
                              status: m.coverageSummary.status,
                              'aria-label': `Coverage status: ${m.coverageSummary.status}`,
                            }),
                            o.createElement(
                              'span',
                              { 'aria-label': `${m.coverageSummary.percentage} percent coverage` },
                              m.coverageSummary.percentage,
                              '%'
                            )
                          )
                        )
                      : o.createElement(
                          f,
                          { size: 'medium', disabled: !0 },
                          o.createElement(B, {
                            isRunning: h,
                            status: I ? 'critical' : 'unknown',
                            'aria-label': 'Coverage status: unknown',
                          })
                        )
                )
              ),
            j &&
              o.createElement(
                $,
                null,
                o.createElement(x, {
                  as: 'label',
                  title: 'Accessibility',
                  icon: t
                    ? null
                    : o.createElement(P, {
                        checked: g.a11y,
                        disabled: h,
                        onChange: () =>
                          u((C) => ({ ...C, config: { ...C.config, a11y: !g.a11y } })),
                      }),
                }),
                o.createElement(
                  T,
                  { hasChrome: !1, trigger: 'hover', tooltip: o.createElement(E, { note: Y }) },
                  o.createElement(
                    f,
                    {
                      size: 'medium',
                      disabled:
                        l['status-value:error'].length === 0 &&
                        l['status-value:warning'].length === 0 &&
                        l['status-value:success'].length === 0,
                      onClick: () => {
                        fe({
                          api: e,
                          entryId:
                            l['status-value:error'][0] ??
                            l['status-value:warning'][0] ??
                            l['status-value:success'][0] ??
                            t?.id,
                          panelId: ve,
                        });
                      },
                    },
                    o.createElement(B, { status: Oe, 'aria-label': Y, isRunning: h }),
                    l['status-value:error'].length + l['status-value:warning'].length || null
                  )
                )
              )
          )
        );
      },
      Ot = ({ context: e, api: t }) => {
        const {
          testProviderState: n,
          componentTestStatusValueToStoryIds: s,
          a11yStatusValueToStoryIds: u,
          storeState: r,
          setStoreState: l,
        } = _e(t, e.id);
        return o.createElement(Ce, {
          api: t,
          entry: e,
          style: { minWidth: 240 },
          testProviderState: n,
          componentTestStatusValueToStoryIds: s,
          a11yStatusValueToStoryIds: u,
          storeState: r,
          setStoreState: l,
          isSettingsUpdated: !1,
        });
      };
    k.register(O, (e) => {
      if ((globalThis.STORYBOOK_BUILDER || '').includes('vite')) {
        const t = (n) => {
          e.setSelectedPanel(n), e.togglePanel(!0);
        };
        je.onSelect(() => {
          t(ye);
        }),
          De.onSelect(() => {
            t(ve);
          }),
          Te.onRunAll(() => {
            y.send({ type: 'TRIGGER_RUN', payload: { triggeredBy: 'run-all' } });
          }),
          y.untilReady().then(() => {
            y.setState((n) => ({
              ...n,
              indexUrl: new URL('index.json', window.location.href).toString(),
            }));
          }),
          k.add(ke, {
            type: J.experimental_TEST_PROVIDER,
            render: () => {
              const [n, s] = R(!1),
                {
                  storeState: u,
                  setStoreState: r,
                  testProviderState: l,
                  componentTestStatusValueToStoryIds: i,
                  a11yStatusValueToStoryIds: c,
                  isSettingsUpdated: g,
                } = _e(e);
              return o.createElement(
                W.Provider,
                { value: { isModalOpen: n, setModalOpen: s } },
                o.createElement(Ce, {
                  api: e,
                  storeState: u,
                  setStoreState: r,
                  isSettingsUpdated: g,
                  testProviderState: l,
                  componentTestStatusValueToStoryIds: i,
                  a11yStatusValueToStoryIds: c,
                }),
                o.createElement(Fe, {
                  storeState: u,
                  onRerun: () => {
                    s(!1), y.send({ type: 'TRIGGER_RUN', payload: { triggeredBy: 'global' } });
                  },
                })
              );
            },
            sidebarContextMenu: ({ context: n }) =>
              n.type === 'docs' || (n.type === 'story' && !n.tags.includes('test'))
                ? null
                : o.createElement(Ot, { context: n, api: e }),
          });
      }
    });
  })();
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
