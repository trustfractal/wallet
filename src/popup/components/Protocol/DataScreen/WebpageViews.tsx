import styled from "styled-components";

import Text, {
  TextWeights,
  TextHeights,
  TextSizes,
} from "@popup/components/common/Text";

import Icon, { IconNames } from "@popup/components/common/Icon";
import LevelIcon from "@popup/components/common/LevelIcon";
import { DataHost } from "@services/DataHost";
import { useEffect, useState } from "react";

interface PageView {
  url: string;
  timestampMs: number;
}

interface StoredItem {
  done: boolean;
  value?: { pageView: PageView };
}

const parseDate = (timestampMs: number) => {
  const dateTime = new Date(timestampMs);

  const date = dateTime.toLocaleDateString("en-GB");
  const time = dateTime
    .toLocaleTimeString("en-GB", { timeStyle: "short", hour12: true })
    .toUpperCase();

  return `${date} - ${time}`;
};

const parseUrl = (url: string) => {
  if (url.length <= 40) return url;

  return url.substring(0, 40) + "...";
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: var(--s-12);
  border: 1px solid rgba(19, 44, 83, 0.2);

  box-shadow: 0px var(--s-8) var(--s-12) #061a3a;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--s-20) var(--s-12);

  background-color: var(--c-gray);

  border-top-left-radius: var(--s-12);
  border-top-right-radius: var(--s-12);
  border: 1px solid rgba(19, 44, 83, 0.2);
  border-bottom: none;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const HeaderIcon = styled.div`
  margin-right: var(--s-12);
`;

const HeaderTitle = styled.div`
  color: var(--c-dark-blue);
`;

const HeaderStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;

  color: var(--c-dark-blue);

  p {
    opacity: 0.6;
  }
`;

const ActivationIcon = styled.div`
  margin-left: var(--s-4);
`;

const LatestWebpageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--s-20) var(--s-12);

  background-color: var(--c-white);

  border-bottom-left-radius: var(--s-12);
  border-bottom-right-radius: var(--s-12);
  border: 1px solid rgba(19, 44, 83, 0.2);
`;

const LatestWebpageInfoText = styled.div`
  color: var(--c-dark-blue);
  opacity: 0.6;
`;

const LatestWebpageText = styled.div`
  margin: var(--s-8) 0;

  color: var(--c-dark-blue);
`;

function ViewHeader() {
  return (
    <HeaderContainer>
      <Header>
        <HeaderInfo>
          <HeaderIcon>
            <LevelIcon level="plus" />
          </HeaderIcon>
          <HeaderTitle>
            <Text weight={TextWeights.BOLD}>Browsing History Data</Text>
          </HeaderTitle>
        </HeaderInfo>
        <HeaderStatus>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            Activated
          </Text>
          <ActivationIcon>
            <Icon name={IconNames.VALID} />
          </ActivationIcon>
        </HeaderStatus>
      </Header>
    </HeaderContainer>
  );
}

function LatestWebpageTextValue({ item }: { item?: StoredItem }) {
  if (!item) return <span>"Fetching webpages..."</span>;
  if (item.done || !item.value) return <span>"No activity yet."</span>;

  return (
    <span>
      Viewed <strong>{parseUrl(item.value.pageView.url)}</strong>
    </span>
  );
}

function LatestWebpage() {
  const [item, setItem] = useState<StoredItem>();

  useEffect(() => {
    (async () => {
      const iterContainer = DataHost.instance().iter();
      const iter = iterContainer[Symbol.asyncIterator]();

      setItem(await iter.next());
    })();
  }, []);

  return (
    <LatestWebpageContainer>
      <LatestWebpageInfoText>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          LAST ACTIVITY
        </Text>
      </LatestWebpageInfoText>
      <LatestWebpageText>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          <LatestWebpageTextValue item={item} />
        </Text>
      </LatestWebpageText>
      <LatestWebpageInfoText>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          {item && item.value && parseDate(item.value.pageView.timestampMs)}
        </Text>
      </LatestWebpageInfoText>
    </LatestWebpageContainer>
  );
}

function WebpageViews() {
  return (
    <Container>
      <ViewHeader />
      <LatestWebpage />
    </Container>
  );
}

export default WebpageViews;
