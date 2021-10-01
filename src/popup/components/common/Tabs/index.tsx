import React, { useState } from "react";

import TabButton from "@popup/components/common/TabButton";

import styled from "styled-components";
import { useLocation } from "react-router";

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
  disabled?: boolean;
};

type TabsProps = {
  tabs: TabType[];
};

function Tabs(props: TabsProps & React.HTMLAttributes<HTMLDivElement>) {
  const { tabs, ...otherProps } = props;
  const query = new URLSearchParams(useLocation().search);
  const activeTab = query.get("activeTab") || tabs[0].id;

  const [selected, setSelected] = useState(activeTab);

  const getSelectedTab = () => {
    const { component: Component, props } = tabs.filter(
      ({ id }) => id === selected,
    )[0];

    return <Component {...props} />;
  };

  return (
    <RootContainer {...otherProps}>
      <TabsButtonsContainer>
        {tabs.map(({ id, label, disabled }, index) => (
          <TabButton
            key={id}
            index={index}
            total={tabs.length}
            onClick={() => setSelected(id)}
            selected={id === selected}
            label={label}
            disabled={disabled}
          />
        ))}
      </TabsButtonsContainer>
      <TabContainer>{getSelectedTab()}</TabContainer>
    </RootContainer>
  );
}

export default Tabs;
