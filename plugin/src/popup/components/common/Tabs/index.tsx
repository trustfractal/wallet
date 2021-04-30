import React from "react";

import TabButton from "@popup/components/common/TabButton";

import styled from "styled-components";

const RootContainer = styled.div``;
const TabsButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const TabContainer = styled.div``;

type TabType = {
  id: string;
  label: string;
};

export type TabsProps = {
  tabs: TabType[];
  children: JSX.Element;
  selected: string;
  setSelected: (id: string) => any;
};

function Tabs(props: TabsProps & React.HTMLAttributes<HTMLDivElement>) {
  const { tabs, selected, setSelected, children } = props;

  return (
    <RootContainer>
      <TabsButtonsContainer>
        {tabs.map(({ id, label }, index) => (
          <TabButton
            key={id}
            index={index}
            total={tabs.length}
            onClick={() => setSelected(id)}
            selected={selected === id}
            label={label}
          />
        ))}
      </TabsButtonsContainer>
      <TabContainer>{children}</TabContainer>
    </RootContainer>
  );
}

export default Tabs;
