import React, { useState, useLayoutEffect } from 'react';
import { _ } from '~/utils'
import { LabelSelectorStyled } from './label-selector.styled';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Label from './label';

const LabelSelector = (props) => {
  const { labels, values = [], multi = false, path = false, withoutLast = false, onChange } = props;
  const { title = '', titlePath, items } = labels;

  const [labelItems, setLabelItems] = useState(items);
  const [hasSelected, setHasSelected] = useState(false);

  useLayoutEffect(() => {
    setLabelItems(labels.items);
    setHasSelected(_.find(labels.items, item => item.selected));
  }, [labels])

  const handleOnClickItem = (item, index) => {
    if (!item.allowed) {
      return;
    }
    if (!multi) {
      onChange([item], index);
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
      setHasSelected(_.find(nextLabelItems, item => item.selected));
      onChange(nextLabelItems);
    }
  };

  return (
    <LabelSelectorStyled>
      {title && <div className="title">{title}</div>}
      <div>
        {
          !path
            ? _.map(labelItems, (item, index) => {
              return (
                <span key={item.attributeValueId} onClick={() => handleOnClickItem(item, index)}>
                  <Label multi={multi} hasSelected={hasSelected} item={item} values={values} />
                </span>

              )
            })
            : _.map(labelItems, (item, index) => {
              return index < items.length - 1
                ? (
                  <span key={item.attributeValueId} style={{ whiteSpace: 'nowrap' }} onClick={() => handleOnClickItem(item, index)}>
                    <Label item={item} values={values} />
                    {
                      index < items.length - 1 && (
                        <KeyboardArrowRightIcon />
                      )
                    }
                  </span>
                )
                : !withoutLast && <div className="leaf unselect">{item.label}</div>
            })
        }
      </div>
    </LabelSelectorStyled>
  );
};

export default LabelSelector;
