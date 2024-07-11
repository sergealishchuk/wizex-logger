import React from "react"
import AutoNumeric from "autonumeric"
import { TextField, InputAdornment } from "@mui/material"
/**
 * CurrencyTextField is a [react](https://reactjs.org/) component with automated currency and number format, and with [Material-ui](https://material-ui.com/) look and feel.
 *
 * CurrencyTextField is a wrapper component for <a href="https://github.com/autoNumeric/autoNumeric">autonumeric</a> and based on <a href="https://github.com/mkg0/react-numeric">react-numeric</a>.
 *
 * Main features:
 * * Adds thousands separator automatically.
 * * Adds automatically the decimals on blur.
 * * Smart input. User can only type the accepted characters depending on the current value.
 * * Lots of config options...
 * * It accepts all the `props` and `classes` of Material-Ui <a href="https://material-ui.com/api/text-field/#textfield-api">TextField API</a> (Ex: classes, label, helperText, variant).
 * * And also all the `options` from <a href="http://autonumeric.org/guide">AutoNumeric</a>
 */

class CurrencyTextField extends React.Component {
  constructor(props) {
    super(props)
    this.getValue = this.getValue.bind(this)
    this.callEventHandler = this.callEventHandler.bind(this)
  }

  componentDidMount() {
    const { currencySymbol, ...others } = this.props
    this.autonumeric = new AutoNumeric(this.input, this.props.value, {
      ...this.props.preDefined,
      ...others,
      onChange: undefined,
      onFocus: undefined,
      onBlur: undefined,
      onKeyPress: undefined,
      onKeyUp: undefined,
      onKeyDown: undefined,
      watchExternalChanges: false,
    })
  }
  componentWillUnmount() {
    this.autonumeric.remove()
  }

  componentWillReceiveProps(newProps) {
    const isValueChanged =
      this.props.value !== newProps.value && this.getValue() !== newProps.value
    if (isValueChanged) {
      this.autonumeric.set(newProps.value)
    }
  }

  getValue() {
    if (!this.autonumeric) return
    const valueMapper = {
      string: numeric => numeric.getNumericString(),
      number: numeric => numeric.getNumber(),
    }
    return valueMapper[this.props.outputFormat](this.autonumeric)
  }
  callEventHandler(event, eventName) {
    if (!this.props[eventName]) return
    this.props[eventName](event, this.getValue())
  }
  render() {
    const {
      currencySymbol,
      inputProps,
      InputProps,
      ...others
    } = this.props

    const otherProps = {}
    ;[
      "id",
      "label",
      "className",
      "autoFocus",
      "variant",
      "style",
      "error",
      "disabled",
      "type",
      "name",
      "defaultValue",
      "tabIndex",
      "fullWidth",
      "rows",
      "rowsMax",
      "select",
      "required",
      "helperText",
      "unselectable",
      "margin",
      "SelectProps",
      "multiline",
      "size",
      "FormHelperTextProps",
      "placeholder",
    ].forEach(prop => (otherProps[prop] = this.props[prop]))

    return (
      <TextField
        inputRef={ref => (this.input = ref)}
        autoComplete="off"
        onChange={e => this.callEventHandler(e, "onChange")}
        onFocus={e => this.callEventHandler(e, "onFocus")}
        onBlur={e => this.callEventHandler(e, "onBlur")}
        onKeyPress={e => this.callEventHandler(e, "onKeyPress")}
        onKeyUp={e => this.callEventHandler(e, "onKeyUp")}
        onKeyDown={e => this.callEventHandler(e, "onKeyDown")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{currencySymbol}</InputAdornment>
          ),
          ...InputProps,
        }}
        inputProps={{
          //className: classes.textField,
          style: {textAlign: 'right', padding: '10px'},
          ...inputProps,
        }}
        {...otherProps}
      />
    )
  }
}


CurrencyTextField.defaultProps = {
  type: "text",
  variant: "standard",
  currencySymbol: "$",
  outputFormat: "number",
  textAlign: "right",
  maximumValue: "10000000000000",
  minimumValue: "-10000000000000",
  decimalPlaces: 2,
}
export default CurrencyTextField

export const predefinedOptions = AutoNumeric.getPredefinedOptions()
