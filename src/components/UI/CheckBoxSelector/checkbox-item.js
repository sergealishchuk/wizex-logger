import { useState, useLayoutEffect } from 'react';
import cn from 'classnames';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { CheckBoxItemStyled } from './checkbox-selector.styled';
import { FlexContainer } from '~/components/StyledComponents';

const CheckBoxItem = ({ item, hasSelectedItems, multi }) => {
  const { label, title, selected, allowed, doc_count, id = '' } = item;

  return (
    <CheckBoxItemStyled className={cn("category-label unselect", { selected, disabled: !allowed })}>
      <FlexContainer jc="flex-start" ai="flex-start">
        {selected ?
          (multi ? <CheckBoxIcon /> : <RadioButtonCheckedIcon />) :
          (multi ? <CheckBoxOutlineBlankIcon /> : <RadioButtonUncheckedIcon />)
        }
        <div style={{ flexGrow: 1, marginLeft: '8px' }}>{id ? id : ''} {label || title} </div>
        <div style={{ letterSpacing: '1px', fontSize: '11px', marginTop: '2px', color: hasSelectedItems ? '#137913' : '#8c3d1a' }}>{allowed && !selected ? `${multi && hasSelectedItems ? '+' : ''}${hasSelectedItems ? doc_count : ''}` : ''}</div>
      </FlexContainer>

    </CheckBoxItemStyled>
  );
};

export default CheckBoxItem;
