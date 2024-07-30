import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TariffsStyled } from './payments.styled';
import { _, c, handleStringWithParams } from '~/utils';
import { Button } from '@mui/material';
import { FlexContainer } from '~/components/StyledComponents';
import cn from 'classnames';

const TariffsGroup = (props) => {
  const { programName = '', tariffList, currentTariff = 5, nextTariff, onChange = _.noop, onClose = _.noop, open, selectedTariff } = props;

  const [currentTariffList, setCurrentTariffList] = useState();
  const [tariffValue, setTariffValue] = useState('');
  const [actualTariff, setActualTariff] = useState(currentTariff);

  useEffect(() => {
    setCurrentTariffList(tariffList);
  }, [tariffList, actualTariff]);

  useEffect(() => {
    if (open) {
      if (open) {
        setTariffValue(actualTariff);
      }
    }
  }, [open]);

  useEffect(() => {
    setActualTariff(nextTariff ? nextTariff : currentTariff);
  }, [currentTariff, nextTariff]);

  const { t } = useTranslation(['buttons', 'sidebar', 'payments']);

  const handleChangeTariff = () => {
    onChange(tariffValue);
  };

  const handleTariffChange = (event) => {
    const selectedTariff = event.target.value;
    setTariffValue(selectedTariff);
    onChange(selectedTariff);
  };

  return (
    <TariffsStyled>
      <FormControl style={{ width: '100%' }}>
        <FormLabel style={{ color: '#333', marginBottom: '8px', borderBottom: '1px #c5c5c5 solid' }}>{t('tariffs', { ns: 'payments' })} <span style={{ fontWeight: 'bold' }}>{programName}</span></FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={tariffValue}
          onChange={handleTariffChange}
        >
          {
            _.map(currentTariffList, item => {
              const { tariff: inputTariff, price } = item;
              const tariff = Number(inputTariff);
              const label = handleStringWithParams(
                t('tariff_item', { ns: 'payments' }),
                {
                  tariff,
                  price,
                }
              );
              return (
                <FormControlLabel
                  key={tariff}
                  className={cn("unselect", { actual: tariff === actualTariff })}
                  value={tariff}
                  control={<Radio size="small" />}
                  disabled={tariff === actualTariff}
                  label={<span style={{ fontWeight: tariff === currentTariff ? 'bold' : 'normal' }}>{`${label}${tariff === currentTariff ? ` (${t('current', { ns: 'payments' })})` : ''}${tariff === nextTariff ? ` (${t('next', { ns: 'payments' })})` : ''}`}</span>}
                />
              )
            })
          }
        </RadioGroup>
      </FormControl>
      <div style={{ marginTop: '16px' }}>
        <FlexContainer jc="space-between">
          <span></span>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            {t('no_change', { ns: 'payments' })}
          </Button>
        </FlexContainer>
      </div>
    </TariffsStyled>
  );
};

export default TariffsGroup;
