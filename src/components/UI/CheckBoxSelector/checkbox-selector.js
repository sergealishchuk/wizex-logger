import React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { _ } from '~/utils'
import { LabelSelectorStyled } from './checkbox-selector.styled';
import CheckBoxItem from './checkbox-item';

const CheckBoxSelector = (props) => {
  const { title = '', total, filterIsActive, items = [], values = [], multi = true, onChange } = props;
  const [hasSelectedItems, setHasSelectedItems] = useState(false);
  const [labelItems, setLabelItems] = useState(items);

  useLayoutEffect(() => {
    setLabelItems(items);
    setHasSelectedItems(!!_.find(items, item => item.selected));
  }, [items]);

  const handleOnClickItem = (item, index) => {
    if (!item.allowed) {
      return;
    }
    if (!multi) {
      onChange([item]);
    } else {
      const indexIncludes = values.indexOf(item);
      const nextValues = [...values];
      if (indexIncludes > -1) {
        nextValues.splice(indexIncludes, 1);
      } else {
        nextValues.push(item);
      }
      const nextLabelItems = [...labelItems];
      nextLabelItems[index].selected = !nextLabelItems[index].selected;
      onChange(nextLabelItems);
    }
  };

  return (
    <LabelSelectorStyled className="checkbox-selector">
      {title && <div className="title">{title}</div>}
      <div>
        {
          _.map(labelItems, (item, index) => (
            <div key={`${item.label}`} onClick={() => handleOnClickItem(item, index)}>
              <CheckBoxItem multi={multi} total={total} filterIsActive={filterIsActive} hasSelectedItems={hasSelectedItems} item={item} values={values} />
            </div>
          ))
        }
      </div>
    </LabelSelectorStyled>
  );
};

export default CheckBoxSelector;
