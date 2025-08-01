import {
  useSlot
} from "./chunk-QRJOACMF.js";
import {
  createSvgIcon
} from "./chunk-3D2U23VT.js";
import {
  memoTheme_default
} from "./chunk-6NG5W2Y6.js";
import {
  useDefaultProps
} from "./chunk-E46GXVJQ.js";
import {
  clsx_default,
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  require_jsx_runtime,
  require_prop_types,
  styled_default
} from "./chunk-VSRWGEDG.js";
import {
  require_react
} from "./chunk-6GAV2S6I.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/@mui/material/Avatar/Avatar.js
var React2 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/material/internal/svg-icons/Person.js
var React = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var Person_default = createSvgIcon((0, import_jsx_runtime.jsx)("path", {
  d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
}), "Person");

// node_modules/@mui/material/Avatar/avatarClasses.js
function getAvatarUtilityClass(slot) {
  return generateUtilityClass("MuiAvatar", slot);
}
var avatarClasses = generateUtilityClasses("MuiAvatar", ["root", "colorDefault", "circular", "rounded", "square", "img", "fallback"]);
var avatarClasses_default = avatarClasses;

// node_modules/@mui/material/Avatar/Avatar.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const {
    classes,
    variant,
    colorDefault
  } = ownerState;
  const slots = {
    root: ["root", variant, colorDefault && "colorDefault"],
    img: ["img"],
    fallback: ["fallback"]
  };
  return composeClasses(slots, getAvatarUtilityClass, classes);
};
var AvatarRoot = styled_default("div", {
  name: "MuiAvatar",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.variant], ownerState.colorDefault && styles.colorDefault];
  }
})(memoTheme_default(({
  theme
}) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 40,
  height: 40,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.pxToRem(20),
  lineHeight: 1,
  borderRadius: "50%",
  overflow: "hidden",
  userSelect: "none",
  variants: [{
    props: {
      variant: "rounded"
    },
    style: {
      borderRadius: (theme.vars || theme).shape.borderRadius
    }
  }, {
    props: {
      variant: "square"
    },
    style: {
      borderRadius: 0
    }
  }, {
    props: {
      colorDefault: true
    },
    style: {
      color: (theme.vars || theme).palette.background.default,
      ...theme.vars ? {
        backgroundColor: theme.vars.palette.Avatar.defaultBg
      } : {
        backgroundColor: theme.palette.grey[400],
        ...theme.applyStyles("dark", {
          backgroundColor: theme.palette.grey[600]
        })
      }
    }
  }]
})));
var AvatarImg = styled_default("img", {
  name: "MuiAvatar",
  slot: "Img",
  overridesResolver: (props, styles) => styles.img
})({
  width: "100%",
  height: "100%",
  textAlign: "center",
  // Handle non-square image.
  objectFit: "cover",
  // Hide alt text.
  color: "transparent",
  // Hide the image broken icon, only works on Chrome.
  textIndent: 1e4
});
var AvatarFallback = styled_default(Person_default, {
  name: "MuiAvatar",
  slot: "Fallback",
  overridesResolver: (props, styles) => styles.fallback
})({
  width: "75%",
  height: "75%"
});
function useLoaded({
  crossOrigin,
  referrerPolicy,
  src,
  srcSet
}) {
  const [loaded, setLoaded] = React2.useState(false);
  React2.useEffect(() => {
    if (!src && !srcSet) {
      return void 0;
    }
    setLoaded(false);
    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) {
        return;
      }
      setLoaded("loaded");
    };
    image.onerror = () => {
      if (!active) {
        return;
      }
      setLoaded("error");
    };
    image.crossOrigin = crossOrigin;
    image.referrerPolicy = referrerPolicy;
    image.src = src;
    if (srcSet) {
      image.srcset = srcSet;
    }
    return () => {
      active = false;
    };
  }, [crossOrigin, referrerPolicy, src, srcSet]);
  return loaded;
}
var Avatar = React2.forwardRef(function Avatar2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiAvatar"
  });
  const {
    alt,
    children: childrenProp,
    className,
    component = "div",
    slots = {},
    slotProps = {},
    imgProps,
    sizes,
    src,
    srcSet,
    variant = "circular",
    ...other
  } = props;
  let children = null;
  const ownerState = {
    ...props,
    component,
    variant
  };
  const loaded = useLoaded({
    ...imgProps,
    ...typeof slotProps.img === "function" ? slotProps.img(ownerState) : slotProps.img,
    src,
    srcSet
  });
  const hasImg = src || srcSet;
  const hasImgNotFailing = hasImg && loaded !== "error";
  ownerState.colorDefault = !hasImgNotFailing;
  delete ownerState.ownerState;
  const classes = useUtilityClasses(ownerState);
  const [ImgSlot, imgSlotProps] = useSlot("img", {
    className: classes.img,
    elementType: AvatarImg,
    externalForwardedProps: {
      slots,
      slotProps: {
        img: {
          ...imgProps,
          ...slotProps.img
        }
      }
    },
    additionalProps: {
      alt,
      src,
      srcSet,
      sizes
    },
    ownerState
  });
  if (hasImgNotFailing) {
    children = (0, import_jsx_runtime2.jsx)(ImgSlot, {
      ...imgSlotProps
    });
  } else if (!!childrenProp || childrenProp === 0) {
    children = childrenProp;
  } else if (hasImg && alt) {
    children = alt[0];
  } else {
    children = (0, import_jsx_runtime2.jsx)(AvatarFallback, {
      ownerState,
      className: classes.fallback
    });
  }
  return (0, import_jsx_runtime2.jsx)(AvatarRoot, {
    as: component,
    className: clsx_default(classes.root, className),
    ref,
    ...other,
    ownerState,
    children
  });
});
true ? Avatar.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Used in combination with `src` or `srcSet` to
   * provide an alt attribute for the rendered `img` element.
   */
  alt: import_prop_types.default.string,
  /**
   * Used to render icon or text elements inside the Avatar if `src` is not set.
   * This can be an element, or just a string.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types.default.elementType,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes) applied to the `img` element if the component is used to display an image.
   * It can be used to listen for the loading error event.
   * @deprecated Use `slotProps.img` instead. This prop will be removed in v7. See [Migrating from deprecated APIs](/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  imgProps: import_prop_types.default.object,
  /**
   * The `sizes` attribute for the `img` element.
   */
  sizes: import_prop_types.default.string,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: import_prop_types.default.shape({
    img: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object])
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: import_prop_types.default.shape({
    img: import_prop_types.default.elementType
  }),
  /**
   * The `src` attribute for the `img` element.
   */
  src: import_prop_types.default.string,
  /**
   * The `srcSet` attribute for the `img` element.
   * Use this attribute for responsive image display.
   */
  srcSet: import_prop_types.default.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object]),
  /**
   * The shape of the avatar.
   * @default 'circular'
   */
  variant: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(["circular", "rounded", "square"]), import_prop_types.default.string])
} : void 0;
var Avatar_default = Avatar;

export {
  getAvatarUtilityClass,
  avatarClasses_default,
  Avatar_default
};
//# sourceMappingURL=chunk-I7EEKDXK.js.map
