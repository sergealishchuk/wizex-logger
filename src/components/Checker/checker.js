import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import { SmallButton, FlexContainer } from '~/components/StyledComponents';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IconButton from '@mui/material/IconButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default (props) => {
  const {
    label = '',
    value = false,
    onChange = _.noop,
    width = 150,
    disabled = false,
  } = props;

  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelectAll = () => {
    if (disabled) return;
    const nextState = !selected;
    setSelected(nextState);
    onChange(nextState);
  }

  return (
    <FlexContainer onClick={handleSelectAll} style={{ marginRight: '10px', width: `${width}px`, fontSize: '13px', cursor: 'pointer' }}>
      {
        selected
          ? (
            <>
              <IconButton disabled={disabled} style={{ justifyContent: 'flex-start', marginLeft: '14px', width: `${width}px`, borderRadius: '4px' }}>
                <DoneAllIcon style={{ color: disabled ? '#bbb' : 'green', fontSize: '17px', marginRight: '6px', marginTop: '-2px', marginLeft: '0px' }} />
                <span style={{ fontSize: '14px' }}>{label}</span>
              </IconButton>
            </>
          )
          : (
            <>
              <IconButton disabled={disabled} style={{ justifyContent: 'flex-start', marginLeft: '14px', borderRadius: '4px', width: `${width}px` }}>
                <CheckBoxOutlineBlankIcon style={{ color: disabled ? '#bbb' : '#777', fontSize: '14px', marginRight: '6px', marginTop: '-2px' }} />
                <span style={{ fontSize: '14px', marginLeft: '3px' }}>{label}</span>
              </IconButton>
            </>
          )
      }
    </FlexContainer>
  )
};
