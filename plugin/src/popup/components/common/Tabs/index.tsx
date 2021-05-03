import React, { useState } from "react";

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
  props: any;
  component: (props: any) => JSX.Element;
};

export type TabsProps = {
  tabs: TabType[];
};

function Tabs(props: TabsProps & React.HTMLAttributes<HTMLDivElement>) {
  const { tabs, ...otherProps } = props;

  const [selected, setSelected] = useState(tabs[0].id);

  const getSelectedTab = () => {
    const { component: Component, props } = tabs.filter(
      ({ id }) => id === selected,
    )[0];

    return <Component {...props} />;
  };

  return (
    <RootContainer {...otherProps}>
      <TabsButtonsContainer>
        {tabs.map(({ id, label }, index) => (
          <TabButton
            key={id}
            index={index}
            total={tabs.length}
            onClick={() => setSelected(id)}
            selected={id === selected}
            label={label}
          />
        ))}
      </TabsButtonsContainer>
      <TabContainer>{getSelectedTab()}</TabContainer>
    </RootContainer>
  );
}

export default Tabs;
