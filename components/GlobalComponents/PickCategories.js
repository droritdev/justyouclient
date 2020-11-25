import React from 'react';
import {StyleSheet} from 'react-native'

import { TagSelect } from 'react-native-tag-select';

const PickCategories = (props) => {
    return (
        <TagSelect
            value={props.value}
            data={props.data}
            itemStyle={styles.item}
            itemLabelStyle={styles.label}
            itemStyleSelected={styles.itemSelected}
            ref={(tag) => {
                this.tag = tag;
            }}
            onItemPress={props.onItemPress}
        />
    )
}

const styles = StyleSheet.create({
    item: {
        borderWidth: 1,
        borderColor: 'deepskyblue',    
        backgroundColor: '#FFF'
    },
    label: {
        color: '#333',
        fontWeight: 'bold'
    },
    itemSelected: {
        backgroundColor: 'deepskyblue',
    }
});

export default PickCategories;