import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { TagsAutocompleteStyled } from './tags-autocomplete.styled';
import { _ } from '~/utils';

const TagsAutocomplete = (props) => {
  const { tagsList: tg, initTags = [], onChange = _.noop } = props;
  const [value, setValue] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const { t } = useTranslation(['buttons', 'articles']);

  useEffect(() => {
    setValue(initTags);
  }, [initTags]);

  useEffect(() => {
    setTagsList(tg || []);
  }, [tg]);

  const handleChange = (__, tags) => {
    onChange(tags);
  };

  return (
    <TagsAutocompleteStyled>
      <Autocomplete
        blurOnSelect
        multiple
        id="size-small-outlined-multi"
        size="small"
        value={value}
        options={tagsList}
        getOptionLabel={(option) => option.name}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => {
          return option.id === value.id
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("article_tags", {ns: 'articles'})}
            placeholder={t("tag", {ns: 'articles'})}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    </TagsAutocompleteStyled>
  )
};

export default TagsAutocomplete;


