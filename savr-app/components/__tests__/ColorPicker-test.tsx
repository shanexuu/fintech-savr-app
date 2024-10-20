import * as React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

import { ColorPicker } from '../../components'
import { Colors } from '../../constants/Colors'

describe('ColorPicker Component', () => {
  let setSelectedColorMock
  let selectedColor

  beforeEach(() => {
    setSelectedColorMock = jest.fn() // Mock the setSelectedColor function
    selectedColor = null // Start with no color selected
  })

  it('highlights the selected color correctly', () => {
    const selectedColor = Colors.color_list[1] // Choose a color to test selection
    const { getAllByTestId } = render(
      <ColorPicker
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColorMock}
      />
    )

    // Get the color options
    const colorOptions = getAllByTestId(/^color-option-/)

    // Check if the second color option has the expected styles
    const secondColorOption = colorOptions[1]

    expect(secondColorOption.props.style).toEqual(
      expect.objectContaining({
        borderWidth: 4,
        borderColor: '#F0F0F0',
        backgroundColor: expect.any(String), // Check if backgroundColor is a string
      })
    )
  })
})
