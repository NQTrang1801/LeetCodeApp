export const QUESTION_CONTENT_QUERY = `
  query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
    }
  }
`;

export const COMMUNITY_SOLUTIONS_QUERY = `
  query communitySolutions($questionSlug: String!, $skip: Int!, $first: Int!, $query: String, $orderBy: TopicSortingOption, $languageTags: [String!], $topicTags: [String!]) {
    questionSolutions(
      filters: {questionSlug: $questionSlug, skip: $skip, first: $first, query: $query, orderBy: $orderBy, languageTags: $languageTags, topicTags: $topicTags}
    ) {
      hasDirectResults
      totalNum
      solutions {
        id
        title
        commentCount
        topLevelCommentCount
        viewCount
        pinned
        isFavorite
        solutionTags {
          name
          slug
        }
        post {
          id
          status
          voteCount
          creationDate
          isHidden
          author {
            username
            isActive
            nameColor
            activeBadge {
              displayName
              icon
            }
            profile {
              userAvatar
              reputation
            }
          }
        }
        searchMeta {
          content
          contentType
          commentAuthor {
            username
          }
          replyAuthor {
            username
          }
          highlights
        }
      }
    }
  }
`;

export const COMMUNITY_SOLUTION_QUERY = `
query communitySolution($topicId: Int!) {
    topic(id: $topicId) {
      id
      viewCount
      topLevelCommentCount
      subscribed
      title
      pinned
      solutionTags {
        name
        slug
      }
      hideFromTrending
      commentCount
      isFavorite
      post {
        id
        voteCount
        voteStatus
        content
        updationDate
        creationDate
        status
        isHidden
        author {
          isDiscussAdmin
          isDiscussStaff
          username
          nameColor
          activeBadge {
            displayName
            icon
          }
          profile {
            userAvatar
            reputation
          }
          isActive
        }
        authorIsModerator
        isOwnPost
      }
    }
  }  
`;
