import { TextInput, TextInputProps } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';

const MultiBulletInput = (props: TextInputProps) => {
    const { bulletChar, onChange, values, ...rest } = props
    const [lines, setLines] = useState(values.length > 0 ? values.length : 1)
    const [value, setValue] = useState(values.join('\n'))
    const [selection, setSelection] = useState({ end: 0, start: 0 });

    const handleChange = useCallback(
        (e) => {
            const newValue = e.nativeEvent.text
            const values = newValue.split('\n')
            const curLines = values.length
            if (curLines !== lines) {
                setLines(curLines)
            }
            setValue(newValue)
            // split the values and return array
            onChange(values)
        },
        [setValue, setLines, lines, onChange]
    )

    useEffect(() => {
        setValue(values.join('\n'))
    }, [values, setValue])

    useEffect(() => {
        const valuesArr = value?.split('\n')
        let temp = []
        valuesArr?.forEach(e => {
            if (e.length > 0 && e[0] != bulletChar) {
                temp.push(`${bulletChar} ${e}`)
            } else {
                temp.push(`${e}`)
            }
        })
        setValue(temp.join('\n') + `${value.length == 0 ? `${bulletChar} ` : `\n${bulletChar} `}`)
    }, [setValue])

    const onKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        setTimeout(() => {
            if (keyValue == 'Enter') {
                if ((selection.start != 0 && selection.end != 0) || (selection.start != value.length - 1 && selection.end != value.length - 1)) {
                    let valueNew = value.slice(0, selection.start) + `\n${bulletChar} ${value.slice(selection.end)}`;
                    setValue(valueNew)
                } else {
                    setValue(`${bulletChar}`)
                }
            }
        }, 50)
    }

    return (
        <TextInput
            multiline
            onSelectionChange={({ nativeEvent: { selection } }) => {
                setSelection(selection)
            }}
            onChange={handleChange}
            value={value}
            {...rest}
            onKeyPress={onKeyPress}
        />
    );
};

export default MultiBulletInput;
