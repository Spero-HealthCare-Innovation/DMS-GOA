import {
  Tablelvl2Context_default
} from "./chunk-X6T3SDSP.js";
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

// node_modules/@mui/material/TableBody/TableBody.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/material/TableBody/tableBodyClasses.js
function getTableBodyUtilityClass(slot) {
  return generateUtilityClass("MuiTableBody", slot);
}
var tableBodyClasses = generateUtilityClasses("MuiTableBody", ["root"]);
var tableBodyClasses_default = tableBodyClasses;

// node_modules/@mui/material/TableBody/TableBody.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getTableBodyUtilityClass, classes);
};
var TableBodyRoot = styled_default("tbody", {
  name: "MuiTableBody",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  display: "table-row-group"
});
var tablelvl2 = {
  variant: "body"
};
var defaultComponent = "tbody";
var TableBody = React.forwardRef(function TableBody2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiTableBody"
  });
  const {
    className,
    component = defaultComponent,
    ...other
  } = props;
  const ownerState = {
    ...props,
    component
  };
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime.jsx)(Tablelvl2Context_default.Provider, {
    value: tablelvl2,
    children: (0, import_jsx_runtime.jsx)(TableBodyRoot, {
      className: clsx_default(classes.root, className),
      as: component,
      ref,
      role: component === defaultComponent ? null : "rowgroup",
      ownerState,
      ...other
    })
  });
});
true ? TableBody.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component, normally `TableRow`.
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var TableBody_default = TableBody;

export {
  getTableBodyUtilityClass,
  tableBodyClasses_default,
  TableBody_default
};
//# sourceMappingURL=chunk-CASNLOGA.js.map
