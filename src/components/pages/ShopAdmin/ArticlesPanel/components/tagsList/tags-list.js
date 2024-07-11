import { _ } from '~/utils';
import { TagsListStyled, TagItemStyled } from './tags-list.styled';

const TagsList = (props) => {
  const { tagsListMap = [], tagsArr = [] } = props;

  return (
    <TagsListStyled>
      {
        _.map(tagsArr, tagId => {
          return (
            tagsListMap[tagId] && <TagItemStyled className="unselect">{tagsListMap[tagId].name}</TagItemStyled>
          )
        })
      }
    </TagsListStyled>
  )
};

export default TagsList;
