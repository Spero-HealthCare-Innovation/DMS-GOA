import {
  Grow_default
} from "./chunk-R5X6BMDT.js";
import {
  useSlot
} from "./chunk-QRJOACMF.js";
import {
  Paper_default
} from "./chunk-KV6OPX2M.js";
import {
  capitalize_default
} from "./chunk-VDLRWNH6.js";
import {
  memoTheme_default
} from "./chunk-6NG5W2Y6.js";
import {
  useDefaultProps
} from "./chunk-E46GXVJQ.js";
import {
  clsx_default,
  composeClasses,
  elementAcceptingRef_default,
  emphasize,
  exactProp,
  extractEventHandlers_default,
  generateUtilityClass,
  generateUtilityClasses,
  getReactElementRef,
  ownerDocument,
  require_jsx_runtime,
  require_prop_types,
  styled_default,
  useEventCallback_default,
  useForkRef,
  useTheme,
  useTimeout
} from "./chunk-VSRWGEDG.js";
import {
  require_react
} from "./chunk-6GAV2S6I.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/@mui/material/Snackbar/Snackbar.js
var React4 = __toESM(require_react());
var import_prop_types3 = __toESM(require_prop_types());

// node_modules/@mui/material/Snackbar/useSnackbar.js
var React = __toESM(require_react());
function useSnackbar(parameters = {}) {
  const {
    autoHideDuration = null,
    disableWindowBlurListener = false,
    onClose,
    open,
    resumeHideDuration
  } = parameters;
  const timerAutoHide = useTimeout();
  React.useEffect(() => {
    if (!open) {
      return void 0;
    }
    function handleKeyDown(nativeEvent) {
      if (!nativeEvent.defaultPrevented) {
        if (nativeEvent.key === "Escape") {
          onClose == null ? void 0 : onClose(nativeEvent, "escapeKeyDown");
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);
  const handleClose = useEventCallback_default((event, reason) => {
    onClose == null ? void 0 : onClose(event, reason);
  });
  const setAutoHideTimer = useEventCallback_default((autoHideDurationParam) => {
    if (!onClose || autoHideDurationParam == null) {
      return;
    }
    timerAutoHide.start(autoHideDurationParam, () => {
      handleClose(null, "timeout");
    });
  });
  React.useEffect(() => {
    if (open) {
      setAutoHideTimer(autoHideDuration);
    }
    return timerAutoHide.clear;
  }, [open, autoHideDuration, setAutoHideTimer, timerAutoHide]);
  const handleClickAway = (event) => {
    onClose == null ? void 0 : onClose(event, "clickaway");
  };
  const handlePause = timerAutoHide.clear;
  const handleResume = React.useCallback(() => {
    if (autoHideDuration != null) {
      setAutoHideTimer(resumeHideDuration != null ? resumeHideDuration : autoHideDuration * 0.5);
    }
  }, [autoHideDuration, resumeHideDuration, setAutoHideTimer]);
  const createHandleBlur = (otherHandlers) => (event) => {
    const onBlurCallback = otherHandlers.onBlur;
    onBlurCallback == null ? void 0 : onBlurCallback(event);
    handleResume();
  };
  const createHandleFocus = (otherHandlers) => (event) => {
    const onFocusCallback = otherHandlers.onFocus;
    onFocusCallback == null ? void 0 : onFocusCallback(event);
    handlePause();
  };
  const createMouseEnter = (otherHandlers) => (event) => {
    const onMouseEnterCallback = otherHandlers.onMouseEnter;
    onMouseEnterCallback == null ? void 0 : onMouseEnterCallback(event);
    handlePause();
  };
  const createMouseLeave = (otherHandlers) => (event) => {
    const onMouseLeaveCallback = otherHandlers.onMouseLeave;
    onMouseLeaveCallback == null ? void 0 : onMouseLeaveCallback(event);
    handleResume();
  };
  React.useEffect(() => {
    if (!disableWindowBlurListener && open) {
      window.addEventListener("focus", handleResume);
      window.addEventListener("blur", handlePause);
      return () => {
        window.removeEventListener("focus", handleResume);
        window.removeEventListener("blur", handlePause);
      };
    }
    return void 0;
  }, [disableWindowBlurListener, open, handleResume, handlePause]);
  const getRootProps = (externalProps = {}) => {
    const externalEventHandlers = {
      ...extractEventHandlers_default(parameters),
      ...extractEventHandlers_default(externalProps)
    };
    return {
      // ClickAwayListener adds an `onClick` prop which results in the alert not being announced.
      // See https://github.com/mui/material-ui/issues/29080
      role: "presentation",
      ...externalProps,
      ...externalEventHandlers,
      onBlur: createHandleBlur(externalEventHandlers),
      onFocus: createHandleFocus(externalEventHandlers),
      onMouseEnter: createMouseEnter(externalEventHandlers),
      onMouseLeave: createMouseLeave(externalEventHandlers)
    };
  };
  return {
    getRootProps,
    onClickAway: handleClickAway
  };
}
var useSnackbar_default = useSnackbar;

// node_modules/@mui/material/ClickAwayListener/ClickAwayListener.js
var React2 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
function mapEventPropToEvent(eventProp) {
  return eventProp.substring(2).toLowerCase();
}
function clickedRootScrollbar(event, doc) {
  return doc.documentElement.clientWidth < event.clientX || doc.documentElement.clientHeight < event.clientY;
}
function ClickAwayListener(props) {
  const {
    children,
    disableReactTree = false,
    mouseEvent = "onClick",
    onClickAway,
    touchEvent = "onTouchEnd"
  } = props;
  const movedRef = React2.useRef(false);
  const nodeRef = React2.useRef(null);
  const activatedRef = React2.useRef(false);
  const syntheticEventRef = React2.useRef(false);
  React2.useEffect(() => {
    setTimeout(() => {
      activatedRef.current = true;
    }, 0);
    return () => {
      activatedRef.current = false;
    };
  }, []);
  const handleRef = useForkRef(getReactElementRef(children), nodeRef);
  const handleClickAway = useEventCallback_default((event) => {
    const insideReactTree = syntheticEventRef.current;
    syntheticEventRef.current = false;
    const doc = ownerDocument(nodeRef.current);
    if (!activatedRef.current || !nodeRef.current || "clientX" in event && clickedRootScrollbar(event, doc)) {
      return;
    }
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    let insideDOM;
    if (event.composedPath) {
      insideDOM = event.composedPath().includes(nodeRef.current);
    } else {
      insideDOM = !doc.documentElement.contains(
        // @ts-expect-error returns `false` as intended when not dispatched from a Node
        event.target
      ) || nodeRef.current.contains(
        // @ts-expect-error returns `false` as intended when not dispatched from a Node
        event.target
      );
    }
    if (!insideDOM && (disableReactTree || !insideReactTree)) {
      onClickAway(event);
    }
  });
  const createHandleSynthetic = (handlerName) => (event) => {
    syntheticEventRef.current = true;
    const childrenPropsHandler = children.props[handlerName];
    if (childrenPropsHandler) {
      childrenPropsHandler(event);
    }
  };
  const childrenProps = {
    ref: handleRef
  };
  if (touchEvent !== false) {
    childrenProps[touchEvent] = createHandleSynthetic(touchEvent);
  }
  React2.useEffect(() => {
    if (touchEvent !== false) {
      const mappedTouchEvent = mapEventPropToEvent(touchEvent);
      const doc = ownerDocument(nodeRef.current);
      const handleTouchMove = () => {
        movedRef.current = true;
      };
      doc.addEventListener(mappedTouchEvent, handleClickAway);
      doc.addEventListener("touchmove", handleTouchMove);
      return () => {
        doc.removeEventListener(mappedTouchEvent, handleClickAway);
        doc.removeEventListener("touchmove", handleTouchMove);
      };
    }
    return void 0;
  }, [handleClickAway, touchEvent]);
  if (mouseEvent !== false) {
    childrenProps[mouseEvent] = createHandleSynthetic(mouseEvent);
  }
  React2.useEffect(() => {
    if (mouseEvent !== false) {
      const mappedMouseEvent = mapEventPropToEvent(mouseEvent);
      const doc = ownerDocument(nodeRef.current);
      doc.addEventListener(mappedMouseEvent, handleClickAway);
      return () => {
        doc.removeEventListener(mappedMouseEvent, handleClickAway);
      };
    }
    return void 0;
  }, [handleClickAway, mouseEvent]);
  return React2.cloneElement(children, childrenProps);
}
true ? ClickAwayListener.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The wrapped element.
   */
  children: elementAcceptingRef_default.isRequired,
  /**
   * If `true`, the React tree is ignored and only the DOM tree is considered.
   * This prop changes how portaled elements are handled.
   * @default false
   */
  disableReactTree: import_prop_types.default.bool,
  /**
   * The mouse event to listen to. You can disable the listener by providing `false`.
   * @default 'onClick'
   */
  mouseEvent: import_prop_types.default.oneOf(["onClick", "onMouseDown", "onMouseUp", "onPointerDown", "onPointerUp", false]),
  /**
   * Callback fired when a "click away" event is detected.
   */
  onClickAway: import_prop_types.default.func.isRequired,
  /**
   * The touch event to listen to. You can disable the listener by providing `false`.
   * @default 'onTouchEnd'
   */
  touchEvent: import_prop_types.default.oneOf(["onTouchEnd", "onTouchStart", false])
} : void 0;
if (true) {
  ClickAwayListener["propTypes"] = exactProp(ClickAwayListener.propTypes);
}

// node_modules/@mui/material/SnackbarContent/SnackbarContent.js
var React3 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());

// node_modules/@mui/material/SnackbarContent/snackbarContentClasses.js
function getSnackbarContentUtilityClass(slot) {
  return generateUtilityClass("MuiSnackbarContent", slot);
}
var snackbarContentClasses = generateUtilityClasses("MuiSnackbarContent", ["root", "message", "action"]);
var snackbarContentClasses_default = snackbarContentClasses;

// node_modules/@mui/material/SnackbarContent/SnackbarContent.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"],
    action: ["action"],
    message: ["message"]
  };
  return composeClasses(slots, getSnackbarContentUtilityClass, classes);
};
var SnackbarContentRoot = styled_default(Paper_default, {
  name: "MuiSnackbarContent",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})(memoTheme_default(({
  theme
}) => {
  const emphasis = theme.palette.mode === "light" ? 0.8 : 0.98;
  const backgroundColor = emphasize(theme.palette.background.default, emphasis);
  return {
    ...theme.typography.body2,
    color: theme.vars ? theme.vars.palette.SnackbarContent.color : theme.palette.getContrastText(backgroundColor),
    backgroundColor: theme.vars ? theme.vars.palette.SnackbarContent.bg : backgroundColor,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "6px 16px",
    borderRadius: (theme.vars || theme).shape.borderRadius,
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      flexGrow: "initial",
      minWidth: 288
    }
  };
}));
var SnackbarContentMessage = styled_default("div", {
  name: "MuiSnackbarContent",
  slot: "Message",
  overridesResolver: (props, styles) => styles.message
})({
  padding: "8px 0"
});
var SnackbarContentAction = styled_default("div", {
  name: "MuiSnackbarContent",
  slot: "Action",
  overridesResolver: (props, styles) => styles.action
})({
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
  paddingLeft: 16,
  marginRight: -8
});
var SnackbarContent = React3.forwardRef(function SnackbarContent2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiSnackbarContent"
  });
  const {
    action,
    className,
    message,
    role = "alert",
    ...other
  } = props;
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime.jsxs)(SnackbarContentRoot, {
    role,
    square: true,
    elevation: 6,
    className: clsx_default(classes.root, className),
    ownerState,
    ref,
    ...other,
    children: [(0, import_jsx_runtime.jsx)(SnackbarContentMessage, {
      className: classes.message,
      ownerState,
      children: message
    }), action ? (0, import_jsx_runtime.jsx)(SnackbarContentAction, {
      className: classes.action,
      ownerState,
      children: action
    }) : null]
  });
});
true ? SnackbarContent.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The action to display. It renders after the message, at the end of the snackbar.
   */
  action: import_prop_types2.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types2.default.object,
  /**
   * @ignore
   */
  className: import_prop_types2.default.string,
  /**
   * The message to display.
   */
  message: import_prop_types2.default.node,
  /**
   * The ARIA role attribute of the element.
   * @default 'alert'
   */
  role: import_prop_types2.default.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types2.default.oneOfType([import_prop_types2.default.arrayOf(import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object, import_prop_types2.default.bool])), import_prop_types2.default.func, import_prop_types2.default.object])
} : void 0;
var SnackbarContent_default = SnackbarContent;

// node_modules/@mui/material/Snackbar/snackbarClasses.js
function getSnackbarUtilityClass(slot) {
  return generateUtilityClass("MuiSnackbar", slot);
}
var snackbarClasses = generateUtilityClasses("MuiSnackbar", ["root", "anchorOriginTopCenter", "anchorOriginBottomCenter", "anchorOriginTopRight", "anchorOriginBottomRight", "anchorOriginTopLeft", "anchorOriginBottomLeft"]);
var snackbarClasses_default = snackbarClasses;

// node_modules/@mui/material/Snackbar/Snackbar.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var useUtilityClasses2 = (ownerState) => {
  const {
    classes,
    anchorOrigin
  } = ownerState;
  const slots = {
    root: ["root", `anchorOrigin${capitalize_default(anchorOrigin.vertical)}${capitalize_default(anchorOrigin.horizontal)}`]
  };
  return composeClasses(slots, getSnackbarUtilityClass, classes);
};
var SnackbarRoot = styled_default("div", {
  name: "MuiSnackbar",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[`anchorOrigin${capitalize_default(ownerState.anchorOrigin.vertical)}${capitalize_default(ownerState.anchorOrigin.horizontal)}`]];
  }
})(memoTheme_default(({
  theme
}) => ({
  zIndex: (theme.vars || theme).zIndex.snackbar,
  position: "fixed",
  display: "flex",
  left: 8,
  right: 8,
  justifyContent: "center",
  alignItems: "center",
  variants: [{
    props: ({
      ownerState
    }) => ownerState.anchorOrigin.vertical === "top",
    style: {
      top: 8,
      [theme.breakpoints.up("sm")]: {
        top: 24
      }
    }
  }, {
    props: ({
      ownerState
    }) => ownerState.anchorOrigin.vertical !== "top",
    style: {
      bottom: 8,
      [theme.breakpoints.up("sm")]: {
        bottom: 24
      }
    }
  }, {
    props: ({
      ownerState
    }) => ownerState.anchorOrigin.horizontal === "left",
    style: {
      justifyContent: "flex-start",
      [theme.breakpoints.up("sm")]: {
        left: 24,
        right: "auto"
      }
    }
  }, {
    props: ({
      ownerState
    }) => ownerState.anchorOrigin.horizontal === "right",
    style: {
      justifyContent: "flex-end",
      [theme.breakpoints.up("sm")]: {
        right: 24,
        left: "auto"
      }
    }
  }, {
    props: ({
      ownerState
    }) => ownerState.anchorOrigin.horizontal === "center",
    style: {
      [theme.breakpoints.up("sm")]: {
        left: "50%",
        right: "auto",
        transform: "translateX(-50%)"
      }
    }
  }]
})));
var Snackbar = React4.forwardRef(function Snackbar2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiSnackbar"
  });
  const theme = useTheme();
  const defaultTransitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };
  const {
    action,
    anchorOrigin: {
      vertical,
      horizontal
    } = {
      vertical: "bottom",
      horizontal: "left"
    },
    autoHideDuration = null,
    children,
    className,
    ClickAwayListenerProps: ClickAwayListenerPropsProp,
    ContentProps: ContentPropsProp,
    disableWindowBlurListener = false,
    message,
    onBlur,
    onClose,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    open,
    resumeHideDuration,
    slots = {},
    slotProps = {},
    TransitionComponent: TransitionComponentProp,
    transitionDuration = defaultTransitionDuration,
    TransitionProps: {
      onEnter,
      onExited,
      ...TransitionPropsProp
    } = {},
    ...other
  } = props;
  const ownerState = {
    ...props,
    anchorOrigin: {
      vertical,
      horizontal
    },
    autoHideDuration,
    disableWindowBlurListener,
    TransitionComponent: TransitionComponentProp,
    transitionDuration
  };
  const classes = useUtilityClasses2(ownerState);
  const {
    getRootProps,
    onClickAway
  } = useSnackbar_default({
    ...ownerState
  });
  const [exited, setExited] = React4.useState(true);
  const handleExited = (node) => {
    setExited(true);
    if (onExited) {
      onExited(node);
    }
  };
  const handleEnter = (node, isAppearing) => {
    setExited(false);
    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };
  const externalForwardedProps = {
    slots: {
      transition: TransitionComponentProp,
      ...slots
    },
    slotProps: {
      content: ContentPropsProp,
      clickAwayListener: ClickAwayListenerPropsProp,
      transition: TransitionPropsProp,
      ...slotProps
    }
  };
  const [Root, rootProps] = useSlot("root", {
    ref,
    className: [classes.root, className],
    elementType: SnackbarRoot,
    getSlotProps: getRootProps,
    externalForwardedProps: {
      ...externalForwardedProps,
      ...other
    },
    ownerState
  });
  const [ClickAwaySlot, {
    ownerState: clickAwayOwnerStateProp,
    ...clickAwayListenerProps
  }] = useSlot("clickAwayListener", {
    elementType: ClickAwayListener,
    externalForwardedProps,
    getSlotProps: (handlers) => ({
      onClickAway: (...params) => {
        var _a;
        (_a = handlers.onClickAway) == null ? void 0 : _a.call(handlers, ...params);
        onClickAway(...params);
      }
    }),
    ownerState
  });
  const [ContentSlot, contentSlotProps] = useSlot("content", {
    elementType: SnackbarContent_default,
    shouldForwardComponentProp: true,
    externalForwardedProps,
    additionalProps: {
      message,
      action
    },
    ownerState
  });
  const [TransitionSlot, transitionProps] = useSlot("transition", {
    elementType: Grow_default,
    externalForwardedProps,
    getSlotProps: (handlers) => ({
      onEnter: (...params) => {
        var _a;
        (_a = handlers.onEnter) == null ? void 0 : _a.call(handlers, ...params);
        handleEnter(...params);
      },
      onExited: (...params) => {
        var _a;
        (_a = handlers.onExited) == null ? void 0 : _a.call(handlers, ...params);
        handleExited(...params);
      }
    }),
    additionalProps: {
      appear: true,
      in: open,
      timeout: transitionDuration,
      direction: vertical === "top" ? "down" : "up"
    },
    ownerState
  });
  if (!open && exited) {
    return null;
  }
  return (0, import_jsx_runtime2.jsx)(ClickAwaySlot, {
    ...clickAwayListenerProps,
    ...slots.clickAwayListener && {
      ownerState: clickAwayOwnerStateProp
    },
    children: (0, import_jsx_runtime2.jsx)(Root, {
      ...rootProps,
      children: (0, import_jsx_runtime2.jsx)(TransitionSlot, {
        ...transitionProps,
        children: children || (0, import_jsx_runtime2.jsx)(ContentSlot, {
          ...contentSlotProps
        })
      })
    })
  });
});
true ? Snackbar.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The action to display. It renders after the message, at the end of the snackbar.
   */
  action: import_prop_types3.default.node,
  /**
   * The anchor of the `Snackbar`.
   * On smaller screens, the component grows to occupy all the available width,
   * the horizontal alignment is ignored.
   * @default { vertical: 'bottom', horizontal: 'left' }
   */
  anchorOrigin: import_prop_types3.default.shape({
    horizontal: import_prop_types3.default.oneOf(["center", "left", "right"]).isRequired,
    vertical: import_prop_types3.default.oneOf(["bottom", "top"]).isRequired
  }),
  /**
   * The number of milliseconds to wait before automatically calling the
   * `onClose` function. `onClose` should then set the state of the `open`
   * prop to hide the Snackbar. This behavior is disabled by default with
   * the `null` value.
   * @default null
   */
  autoHideDuration: import_prop_types3.default.number,
  /**
   * Replace the `SnackbarContent` component.
   */
  children: import_prop_types3.default.element,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types3.default.object,
  /**
   * @ignore
   */
  className: import_prop_types3.default.string,
  /**
   * Props applied to the `ClickAwayListener` element.
   * @deprecated Use `slotProps.clickAwayListener` instead. This prop will be removed in v7. See [Migrating from deprecated APIs](/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  ClickAwayListenerProps: import_prop_types3.default.object,
  /**
   * Props applied to the [`SnackbarContent`](https://mui.com/material-ui/api/snackbar-content/) element.
   * @deprecated Use `slotProps.content` instead. This prop will be removed in v7. See [Migrating from deprecated APIs](/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  ContentProps: import_prop_types3.default.object,
  /**
   * If `true`, the `autoHideDuration` timer will expire even if the window is not focused.
   * @default false
   */
  disableWindowBlurListener: import_prop_types3.default.bool,
  /**
   * When displaying multiple consecutive snackbars using a single parent-rendered
   * `<Snackbar/>`, add the `key` prop to ensure independent treatment of each message.
   * For instance, use `<Snackbar key={message} />`. Otherwise, messages might update
   * in place, and features like `autoHideDuration` could be affected.
   */
  key: () => null,
  /**
   * The message to display.
   */
  message: import_prop_types3.default.node,
  /**
   * @ignore
   */
  onBlur: import_prop_types3.default.func,
  /**
   * Callback fired when the component requests to be closed.
   * Typically `onClose` is used to set state in the parent component,
   * which is used to control the `Snackbar` `open` prop.
   * The `reason` parameter can optionally be used to control the response to `onClose`,
   * for example ignoring `clickaway`.
   *
   * @param {React.SyntheticEvent<any> | Event} event The event source of the callback.
   * @param {string} reason Can be: `"timeout"` (`autoHideDuration` expired), `"clickaway"`, or `"escapeKeyDown"`.
   */
  onClose: import_prop_types3.default.func,
  /**
   * @ignore
   */
  onFocus: import_prop_types3.default.func,
  /**
   * @ignore
   */
  onMouseEnter: import_prop_types3.default.func,
  /**
   * @ignore
   */
  onMouseLeave: import_prop_types3.default.func,
  /**
   * If `true`, the component is shown.
   */
  open: import_prop_types3.default.bool,
  /**
   * The number of milliseconds to wait before dismissing after user interaction.
   * If `autoHideDuration` prop isn't specified, it does nothing.
   * If `autoHideDuration` prop is specified but `resumeHideDuration` isn't,
   * we default to `autoHideDuration / 2` ms.
   */
  resumeHideDuration: import_prop_types3.default.number,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: import_prop_types3.default.shape({
    clickAwayListener: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.shape({
      children: import_prop_types3.default.element.isRequired,
      disableReactTree: import_prop_types3.default.bool,
      mouseEvent: import_prop_types3.default.oneOf(["onClick", "onMouseDown", "onMouseUp", "onPointerDown", "onPointerUp", false]),
      onClickAway: import_prop_types3.default.func,
      touchEvent: import_prop_types3.default.oneOf(["onTouchEnd", "onTouchStart", false])
    })]),
    content: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    root: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    transition: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object])
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: import_prop_types3.default.shape({
    clickAwayListener: import_prop_types3.default.elementType,
    content: import_prop_types3.default.elementType,
    root: import_prop_types3.default.elementType,
    transition: import_prop_types3.default.elementType
  }),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types3.default.oneOfType([import_prop_types3.default.arrayOf(import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object, import_prop_types3.default.bool])), import_prop_types3.default.func, import_prop_types3.default.object]),
  /**
   * The component used for the transition.
   * [Follow this guide](https://mui.com/material-ui/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @deprecated Use `slots.transition` instead. This prop will be removed in v7. See [Migrating from deprecated APIs](/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   * @default Grow
   */
  TransitionComponent: import_prop_types3.default.elementType,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default {
   *   enter: theme.transitions.duration.enteringScreen,
   *   exit: theme.transitions.duration.leavingScreen,
   * }
   */
  transitionDuration: import_prop_types3.default.oneOfType([import_prop_types3.default.number, import_prop_types3.default.shape({
    appear: import_prop_types3.default.number,
    enter: import_prop_types3.default.number,
    exit: import_prop_types3.default.number
  })]),
  /**
   * Props applied to the transition element.
   * By default, the element is based on this [`Transition`](https://reactcommunity.org/react-transition-group/transition/) component.
   * @deprecated Use `slotProps.transition` instead. This prop will be removed in v7. See [Migrating from deprecated APIs](/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   * @default {}
   */
  TransitionProps: import_prop_types3.default.object
} : void 0;
var Snackbar_default = Snackbar;

export {
  ClickAwayListener,
  getSnackbarContentUtilityClass,
  snackbarContentClasses_default,
  SnackbarContent_default,
  getSnackbarUtilityClass,
  snackbarClasses_default,
  Snackbar_default
};
//# sourceMappingURL=chunk-62KB6GOJ.js.map
