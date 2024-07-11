import React from 'react';
import cn from 'classnames';
import { LabelStyled } from './label-selector.styled';

const Label = ({ item, hasSelected, multi }) => {
  const { label, id, selected, allowed, count } = item;

  let sign = hasSelected && multi ? '+' : '';
  let countLabel = selected ? '' : (count > 0 ? `${sign}${count}` : '');
  let hasCountLabel = countLabel.length > 0;
  return (
    <LabelStyled className={cn("category-label unselect", { selected, disabled: !allowed })}>
      <div style={{position: 'relative'}}>{label}{hasCountLabel && <span className="badge-count">{countLabel}</span>}</div>
    </LabelStyled>
  );
};

export default Label;
