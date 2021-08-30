import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  ViewPropTypes,
  StyleSheet
} from 'react-native'

import TagSelectItem from './TagSelectItem'

Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );

class TagSelect extends React.Component {
  static propTypes = {
    // Pre-selected values
    value: PropTypes.array,

    // Objet keys
    labelAttr: PropTypes.string,
    keyAttr: PropTypes.string,

    // Available data
    data: PropTypes.array,

    // validations
    max: PropTypes.number,

    // Callbacks
    onMaxError: PropTypes.func,
    onItemPress: PropTypes.func,

    // Styles
    containerStyle: ViewPropTypes.style
  }

  static defaultProps = {
    value: [],

    labelAttr: 'label',
    keyAttr: 'id',

    data: [],

    max: null,

    onMaxError: null,
    onItemPress: null,

    containerStyle: {}
  }

  state = {
    value: {}
  }

  componentDidMount () {
    const value = {}
    this.props.value.forEach((val) => {
      value[val[[this.props.keyAttr]] || val] = val
    })

    this.setState({ value })
  }



  /**
   * @description Return the number of items selected
   * @return {Number}
   */
  get totalSelected () {
    return Object.keys(this.state.value).length
  }

  /**
   * @description Return the items selected
   * @return {Array}
   */
  get itemsSelected () {
    const items = []

    Object.entries(this.state.value).forEach(([key]) => {
      items.push(this.state.value[key])
    })

    return items
  }

  /**
   * @description Callback after select an item
   * @param {Object} item
   * @return {Void}
   */
  handleSelectItem = (item) => {
    console.log('handleselectitem item ', item)
    const key = item[this.props.keyAttr] || item
    console.log('handleselectitem key of item ', key)
    const value = { ...this.state.value }
    console.log('handleselectitem value ', value)
    const found = this.state.value[key]
    console.log('handleselectitem found ', found)
    // Item is on array, so user is removing the selection
    var newValue = {}
    var isDeselected = false
    if (found) {
      console.log('hendleselctitem in if found value[key] ', key, value[key])
      delete value[key]
      console.log('hendleselctitem in if found after delete value ', key, value)
      newValue: {}
      isDeselected = true
    } else {
      // User is adding but has reached the max number permitted
      if (this.props.max && this.totalSelected >= this.props.max) {
        if (this.props.onMaxError) {
          return this.props.onMaxError()
        }
      }
      console.log('handleselectitem in else - selecting')
      value[key] = item
      console.log('handleselectitem in else value-key ', value[key])
      console.log('handleselectitem in else value ', value)

      newValue = Object.filter(value, valueItem => {
        console.log('valueItem ', valueItem, valueItem.id, key)
        return valueItem.id.toString() === key.toString()
      })
      console.log('handleselectitem in else newValue ', newValue)
    }
    console.log('handleselectitem before return ', value)
    return this.setState({ value: newValue }, () => {
      if (this.props.onItemPress) {
        this.props.onItemPress(item, isDeselected)
      }
    })
  }

  render () {
    return (
      <View
        style={[
          styles.container,
          this.props.containerStyle
        ]}
      >
        {this.props.data.map((i) => {
          return (
            <TagSelectItem
              {...this.props}
              label={i[this.props.labelAttr] ? i[this.props.labelAttr] : i}
              key={i[this.props.keyAttr] ? i[this.props.keyAttr] : i}
              onPress={this.handleSelectItem.bind(this, i)}
              selected={(this.state.value[i[this.props.keyAttr]] || this.state.value[i]) && true}
            />
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
})



class TagSelectExtension extends TagSelect {

	handleSelectItem2 = (item) => {
		const key = item[this.props.keyAttr] || item

		const value = []
		const found = this.state.value[key]

		value[key] = item
		return this.setState({ value }, () => {
			if (this.props.onItemPress) {
				this.props.onItemPress(item)
			}
		})
	}

}

export default TagSelectExtension
