import { connect, pushTrigger } from '~/utils/shed';

import { _ } from '~/utils';
import { useEffect, useState, useRef } from "react";
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import ClearIcon from '@mui/icons-material/Clear';
import { SearchStyled, ShadowStyled } from "./search.styled";
import { IconButton, Button } from "@mui/material";
import { searchService } from "~/http/services";
import { Observer } from '~/utils';

const searchQueryChange = _.debounce((query, cb = _.noop) => {
  cb(query);
}, 400);

function replaceAll(str, source) {
  let re = new RegExp(source.trim().split(' ').join('|'), 'gi');
  return str.replace(re, (matches, offset, string) =>
    offset === 0 || string[offset - 1] === ' '
      ? `<b>${matches}</b>`
      : matches
  );
};

const SearchDialog = (props) => {
  const { triggerOpenSearchDialog } = props.store;

  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeSearchValue, setActiveSearchValue] = useState('');
  const [resultList, setResultList] = useState([]);
  const [receivedKeyDown, setReceivedKeyDown] = useState({});
  const [historyMode, setHistoryMode] = useState(false);
  const [firstRequest, setFirstRequest] = useState(true);
  const [findInProgress, setFindInProgress] = useState(false);
  const [cursorPointerIndex, setCursorPointerIndex] = useState(0);
  const [cancelSearchRequest, setCancelSearchRequest] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const { t } = useTranslation(['buttons']);

  const inputRef = useRef();
  const buttonRef = useRef();
  const router = useRouter();

  const sendSearchRequest = async (values) => {
    if (cancelSearchRequest) return;

    setFindInProgress(true);
    const searchResult = await searchService.getSearchSuggestions(values);

    if (searchResult && searchResult.ok) {

      const { suggestionList } = searchResult;

      setFirstRequest(true);

      const hitsWithHighlited = _.map(suggestionList, item => ({
        suggestion: item.text,
        hightlitedSuggestion: item.highlighted,
      }));

      setResultList(hitsWithHighlited);
      setFindInProgress(false);
      setCursorPointerIndex(0);
    }
    setCancelSearchRequest(false);
  }

  useEffect(() => {
    const { key } = receivedKeyDown;

    if (key === 'ESC' && open) {
      handleCloseSearch();
    } else if (key === 'ALT_83' && !open) {
      if (router.asPath.startsWith('/shop/') || router.pathname === "/") {
        Observer.send('onGoToTheSearchLine');
      } else {
        pushTrigger('triggerOpenSearchDialog');
      }
    }
  }, [receivedKeyDown]);

  useEffect(() => {
    const documentKeyDownRef = Observer.addListener('onDocumentKeyDown', (key) => {
      setReceivedKeyDown({
        key,
        time: new Date().getTime(),
      });
    });

    return () => {
      Observer.removeListener(documentKeyDownRef);
    }
  }, []);

  useEffect(() => {
    setReadOnly(false);
    inputRef.current.focus();
    setFirstRequest(false);
  }, [opened]);

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      searchQueryChange(searchValue, (query) => {
        sendSearchRequest({ text: query });
      });
    }
  }, [searchValue]);

  useEffect(() => {
    if (!_.isUndefined(triggerOpenSearchDialog)) {
      setOpen(true);
      setTimeout(() => setOpened(true), 200);
    }
  }, [triggerOpenSearchDialog]);

  const handleSearchChange = (event) => {
    if (open) {
      const { value } = event.target;
      setSearchValue(value);
      setActiveSearchValue(value);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setActiveSearchValue('');
    inputRef.current.focus();
  };

  const handleCloseSearch = () => {
    setOpen(false);
    setOpened(false);
    setSearchValue('');
    setActiveSearchValue('');
    setResultList([]);
    setTimeout(() => buttonRef.current.focus(), 0);
  };

  const handleClickPreventor = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleItemClick = (index) => {
    handleCloseSearch();
    // const shopUrl = createShopUrl({
    //   text: resultList[index].suggestion,
    // });
    // router.push(shopUrl);
  };

  const handleKeyDown = (event) => {
    const { keyCode, altKey, ctrlKey } = event;
    if (!altKey && !ctrlKey) {
      if ([38, 40].includes(keyCode)) {
        let nextCursorPointer;
        if (keyCode === 40) {
          nextCursorPointer = cursorPointerIndex + 1;
          if (nextCursorPointer > resultList.length) {
            nextCursorPointer = 0;
          }
        }
        if (keyCode === 38) {
          nextCursorPointer = cursorPointerIndex - 1;
          if (nextCursorPointer < 0) {
            nextCursorPointer = resultList.length;
          }
        }

        setCancelSearchRequest(true);
        setCursorPointerIndex(nextCursorPointer);
        if (nextCursorPointer === 0) {
          setSearchValue(activeSearchValue);
        } else {
          setSearchValue(resultList[nextCursorPointer - 1].suggestion);
        }

        setTimeout(() => {
          const end = inputRef.current.value.length;
          inputRef.current.setSelectionRange(end, end);
        }, 0);

        inputRef.current.focus();
      } else if (keyCode === 13) {
        handleGoToSearchPage();
      } else {
        setCancelSearchRequest(false);
      }
    }
  };

  const handleKeyUp = (event) => {
    const { keyCode } = event;
    if (keyCode === 17) {
      setFirstRequest(false);
      setHistoryMode(false);
    }
  };

  const handleMouseOver = (index) => {
    setCursorPointerIndex(index + 1);
  };

  const handleMouseOut = () => {
    setCursorPointerIndex(0);
  }

  const handleGoToSearchPage = () => {
    setReadOnly(true);
    setTimeout(() => buttonRef.current.focus(), 0);
    handleCloseSearch();
    // const shopUrl = createShopUrl({
    //   text: searchValue,
    // });
    // router.push(shopUrl);
  };

  return (
    <>
      <ShadowStyled className={cn({ open })} onClick={handleCloseSearch} />

      <SearchStyled className={cn({ open, opened })} onClick={handleCloseSearch}>
        <div className="search-container" onClick={handleClickPreventor}>
          <div className="search-box">
            {
              findInProgress
                ? <SavedSearchIcon style={{ fontSize: '17px', color: '#6a6a6a' }} />
                : <SearchIcon style={{ fontSize: '17px' }} />
            }
            <TextField
              inputRef={inputRef}
              autoComplete="off"
              inputProps={{ spellCheck: 'false' }}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              readOnly={readOnly}
            />
            <IconButton disabled={searchValue.trim().length === 0} onClick={handleClearSearch} style={{ marginRight: '6px' }}>
              <ClearIcon style={{ fontSize: '17px', transition: 'all 500ms' }} />
            </IconButton>
            <Button
              ref={buttonRef}
              tabIndex="-1"
              className="search-button"
              onClick={handleGoToSearchPage}
            >
              {t("search", { ns: "buttons" })}
            </Button>
          </div>
          {resultList.length > 0 && (
            <div className="search-result-container" style={{ opacity: open ? 1 : 0, transition: 'opacity 200ms', display: (searchValue.trim().length === 0 || historyMode || !firstRequest) ? 'none' : 'block' }}>
              <div className="search-result">
                {
                  _.map(resultList, (item, index) => (
                    <div
                      key={index}
                      className={cn("unselect result-item", { active: (index + 1) === cursorPointerIndex })}
                      onClick={() => handleItemClick(index)}
                      onMouseOver={() => handleMouseOver(index)}
                      onMouseOut={handleMouseOut}
                      dangerouslySetInnerHTML={{
                        __html: item.hightlitedSuggestion,
                      }}
                    />
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </SearchStyled>
    </>
  )
};

export default connect(['triggerOpenSearchDialog'])(SearchDialog);
