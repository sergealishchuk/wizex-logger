import { useState, useEffect, useRef } from 'react';
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'next-i18next';
import { IconButton } from "@mui/material";
import { SearchLineStyled } from "./article-drawer.styled";
import { _ } from '~/utils';

const searchQueryChange = _.debounce((query, cb = _.noop) => {
  cb(query);
}, 400);

export default (props) => {
  const { sendSearchRequest = _.noop } = props;
  const [searchValue, setSearchValue] = useState('');

  const { t } = useTranslation(['articles']);

  const inputRef = useRef();

  useEffect(() => {
    searchQueryChange(searchValue, (query) => {
      sendSearchRequest({ text: query });
    });
  }, [searchValue]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  const handleInputSetFocus = () => {
    inputRef.current.focus();
  };

  const handleClearSearch = () => {
    setSearchValue('');
    inputRef.current.focus();
  };

  return (
    <SearchLineStyled>
      <div className="search-container" onClick={handleInputSetFocus}>
        <div className="search-box">
          <SearchIcon style={{ fontSize: '17px', color: '#777', marginLeft: '8px' }} />
          <div style={{ width: '100%', padding: '5px 0', marginLeft: '3px' }}>
            <TextField
              inputRef={inputRef}
              autoComplete="off"
              inputProps={{ spellCheck: 'false' }}
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={t('search_line_placeholder', {ns: 'articles'})}
            />
          </div>
          <IconButton disabled={searchValue.trim().length === 0} onClick={handleClearSearch} style={{ marginRight: '6px' }}>
            <ClearIcon style={{ fontSize: '17px', transition: 'all 500ms' }} />
          </IconButton>
        </div>
      </div>
    </SearchLineStyled>
  )
};
