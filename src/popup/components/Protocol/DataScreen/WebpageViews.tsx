import styled from "styled-components";

import Text, {
  TextWeights,
  TextHeights,
  TextSizes,
} from "@popup/components/common/Text";

import Icon, { IconNames } from "@popup/components/common/Icon";
import LevelIcon from "@popup/components/common/LevelIcon";
import { DataHost } from "@services/DataHost";
import { MouseEventHandler, useEffect, useState } from "react";

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
  const matches = url.match(/^(https?:\/\/)?(.*)\/?$/);

  if (!matches) return;

  return matches[2];
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

const UrlContainer = styled.div`
  max-width: 275px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
  if (!item) return <span>Fetching webpages...</span>;
  if (item.done || !item.value) return <span>No activity yet.</span>;

  return (
    <UrlContainer>
      Viewed <strong>{parseUrl(item.value.pageView.url)}</strong>
    </UrlContainer>
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

const WebpageHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: var(--c-white);
  border-bottom-left-radius: var(--s-12);
  border-bottom-right-radius: var(--s-12);
  border: 1px solid rgba(19, 44, 83, 0.2);
`;

const WebpageHistoryHeader = styled.div<{ altStyle?: boolean }>`
  padding: var(--s-20) var(--s-12);

  background-color: ${(props) =>
    props.altStyle ? "var(--c-orange)" : "var(--c-white)"};

  color: ${(props) => (props.altStyle ? "var(--c-white)" : "var(--c-orange)")};

  &:hover {
    cursor: pointer;
  }
`;

const WebpageHeaderText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const WebpageListContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: var(--s-20) var(--s-12);
`;

const WebpageList = styled.div`
  display: flex;
  flex-direction: column;
`;

const WebpageListTitle = styled.div`
  margin-bottom: var(--s-12);
  color: var(--c-dark-blue);
`;

const WebpageEntryContainer = styled.div`
  margin-top: var(--s-20);

  &:not(:last-child) {
    border-bottom: 1px solid var(--c-gray);
  }
`;

const WebpageEntryTimestamp = styled.div`
  margin-bottom: var(--s-8);

  color: var(--c-dark-blue);
  opacity: 0.6;
`;

const WebpageEntryUrl = styled.div`
  margin-bottom: var(--s-20);

  color: var(--c-dark-blue);
`;

function WebpageHistoryClosedHeader({
  onClick,
}: {
  onClick: MouseEventHandler;
}) {
  return (
    <WebpageHistoryHeader onClick={onClick}>
      <WebpageHeaderText>
        <Text weight={TextWeights.SEMIBOLD}>VIEW HISTORY</Text>

        <Icon name={IconNames.CHEVRON_RIGHT} />
      </WebpageHeaderText>
    </WebpageHistoryHeader>
  );
}

function WebpageHistoryOpenHeader({ onClick }: { onClick: MouseEventHandler }) {
  return (
    <WebpageHistoryHeader altStyle onClick={onClick}>
      <WebpageHeaderText>
        <Icon name={IconNames.CHEVRON_LEFT} />

        <Text weight={TextWeights.SEMIBOLD}>CLOSE</Text>
      </WebpageHeaderText>
    </WebpageHistoryHeader>
  );
}

function WebpageEntry({ website }: { website: PageView }) {
  return (
    <WebpageEntryContainer>
      <WebpageEntryTimestamp>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          {parseDate(website.timestampMs)}
        </Text>
      </WebpageEntryTimestamp>

      <WebpageEntryUrl>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          <UrlContainer>
            Viewed <strong>{parseUrl(website.url)}</strong>
          </UrlContainer>
        </Text>
      </WebpageEntryUrl>
    </WebpageEntryContainer>
  );
}

function WebpageHistoryList() {
  const iterContainer = DataHost.instance().iter();
  const iter = iterContainer[Symbol.asyncIterator]();

  const [websites, setWebsites] = useState<PageView[]>([]);

  useEffect(() => {
    (async () => {
      const toShow = [];

      for await (let page of DataHost.instance().iter()) {
        toShow.push(page.pageView);
        if (toShow.length >= 4) break;
      }

      setWebsites(toShow);
    })();
  }, [iter]);

  return (
    <WebpageListContainer>
      <WebpageListTitle>
        <Text>ACTIVITY HISTORY</Text>
      </WebpageListTitle>

      {websites.length === 0 ? (
        <WebpageEntryTimestamp>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            No activity yet.
          </Text>
        </WebpageEntryTimestamp>
      ) : (
        <WebpageList>
          {websites.map((website, i) => (
            <WebpageEntry website={website} key={i} />
          ))}
        </WebpageList>
      )}
    </WebpageListContainer>
  );
}

function WebpageHistory({
  open,
  onClick,
}: {
  open: boolean;
  onClick: MouseEventHandler;
}) {
  if (!open) return <WebpageHistoryClosedHeader onClick={onClick} />;

  return (
    <WebpageHistoryContainer>
      <WebpageHistoryOpenHeader onClick={onClick} />
      <WebpageHistoryList />
    </WebpageHistoryContainer>
  );
}

function WebpageViews() {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const onClick = () => setHistoryOpen(!historyOpen);

  return (
    <Container>
      <ViewHeader />
      <WebpageHistory open={historyOpen} onClick={onClick} />

      {!historyOpen && <LatestWebpage />}
    </Container>
  );
}

export default WebpageViews;
