import React, { useState } from "react";
import PubSub from "pubsub-js";
import { Input, Menu, Modal, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import "./index.css";

const ToolBar = (props) => {
  const options = ["Add Node", "Add Edge"];
  const [collapsed, setCollapsed] = useState(false);
  const [openEdgeDialog, setOpenEdgeDialog] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const handleOptionClick = (op) => {
    return () => {
      if (op === "Add Node") {
        PubSub.publish("add-node-ready", {});
      } else if (op === "Add Edge") {
        setOpenEdgeDialog(true);
      }
    };
  };
  const menuItems = [
    getMenuItem("1", "123", "", [getMenuItem("1-1", "Add Node", "", [])]),
  ];

  const handleCancel = () => {
    setOpenEdgeDialog(false);
  };

  const handleConfirm = () => {
    PubSub.publish("edge-add-ready", {
      from: startIndex.toString(),
      to: endIndex.toString(),
    });
    setOpenEdgeDialog(false);
  };

  const handleStartIndexChange = (e) => {
    setStartIndex(e.target.value);
  };

  const handleEndIndexChange = (e) => {
    setEndIndex(e.target.value);
  };

  const handleStabilizationToggle = (e) => {
    PubSub.publish("toggle-physics", { toggle: e });
  };

  const settingItems = [
    {
      key: "1",
      label: (
        // <p className={""}>
        //   <span className={""}>Auto Stabilization</span>
        //   <Switch defaultChecked onChange={handleStabilizationToggle} />
        // </p>
        <button></button>
      ),
    },
  ];

  return (
    <div className={"toolbar space-y-4"}>
      <Typography>
        <div>H</div>
        <Content>
          <Menu items={menuItems}>
            {/*{options.map((op, index) => {*/}
            {/*  return (*/}
            {/*    <Menu.Item key={index}>*/}
            {/*      <button*/}
            {/*        key={index}*/}
            {/*        className={"toolbar-btn"}*/}
            {/*        onClick={handleOptionClick(op)}*/}
            {/*      >*/}
            {/*        {op}*/}
            {/*      </button>*/}
            {/*    </Menu.Item>*/}
            {/*  );*/}
            {/*})}*/}
            {/*<Menu.Item title={"Setting"} icon={<SettingTwoTone />}>*/}
            {/*  <Menu.SubMenu children={<p>ceshi</p>}></Menu.SubMenu>*/}
            {/*</Menu.Item>*/}
          </Menu>
        </Content>
      </Typography>
      <div>
        <Modal
          className={"add-edge-dialog"}
          title={"Add an Edge"}
          open={openEdgeDialog}
          onCancel={handleCancel}
          onOk={handleConfirm}
          centered
        >
          <Input
            prefix={<p>Start Node Id:</p>}
            placeholder={"Please enter start node id"}
            type={"number"}
            defaultValue={0}
            min={0}
            max={999}
            maxLength={99}
            required={true}
            onChange={handleStartIndexChange}
          />
          <Input
            prefix={<p>End Node Id:</p>}
            placeholder={"Please enter end node id"}
            type={"number"}
            defaultValue={0}
            min={0}
            max={999}
            maxLength={99}
            required={true}
            onChange={handleEndIndexChange}
          />
        </Modal>
      </div>
    </div>
  );
};

const getMenuItem = (key, label, icon, children) => {
  return {
    key,
    label,
    icon,
    children,
  };
};

export default ToolBar;
