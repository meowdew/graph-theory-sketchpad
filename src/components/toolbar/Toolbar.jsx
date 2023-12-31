import React, { useState } from "react";
import PubSub from "pubsub-js";
import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  Input,
  Menu,
  Modal,
  Switch,
} from "antd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import "./toolbar.css";

const ToolBar = (props) => {
  const { setAutoStabilization, autoStabilization } = props;

  const [collapsed, setCollapsed] = useState(false);
  const [openEdgeDialog, setOpenEdgeDialog] = useState(false);
  const [openSettingDrawer, setOpenSettingDrawer] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [isArc, setIsArc] = useState(false);

  const handleCancel = () => {
    setOpenEdgeDialog(false);
    setIsArc(false);
  };

  const handleConfirm = () => {
    PubSub.publish("edge-add-ready", {
      from: startIndex.toString(),
      to: endIndex.toString(),
      arrows: isArc ? "to" : "none",
    });
    setOpenEdgeDialog(false);
    setIsArc(false);
  };

  const handleStartIndexChange = (e) => {
    setStartIndex(e.target.value);
  };

  const handleEndIndexChange = (e) => {
    setEndIndex(e.target.value);
  };

  const handleStabilizationToggle = (e) => {
    setAutoStabilization(!autoStabilization);
  };

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  const handleMenuClick = (e) => {
    if (e.key === "AddNode") {
      PubSub.publish("add-node-ready", {});
    } else if (e.key === "AddEdge") {
      setOpenEdgeDialog(true);
    } else if (e.key === "Adjacency") {
    } else if (e.key === "Settings") {
      setOpenSettingDrawer(true);
    } else if (e.key === "DegreeSequence") {
      PubSub.publish("degree-sequence", {});
    }
  };

  function getItem(key, label, icon, children) {
    return {
      key: key,
      label: label,
      icon: icon,
      children: children,
    };
  }

  const menuItems = [
    getItem("Node", "Node", <AddCircleIcon className={"menu-icon"} />, [
      getItem("AddNode", "Add Node"),
    ]),
    getItem("Edge", "Edge", <OpenInFullOutlinedIcon />, [
      getItem("AddEdge", "Add Edge"),
    ]),
    // getItem("Algorithm", "Algorithm", <PolylineIcon />, [
    //   getItem("SpanningTree", "Find Spanning Tree"),
    // ]),
    getItem("Settings", "Settings", <SettingsIcon />, null),
  ];

  function handleChecked(e) {
    setIsArc(e.target.checked);
  }

  return (
    <div className={"toolbar space-y-4"}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        className={"btn-collapse"}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        className={"menu font-sans"}
        mode="inline"
        inlineCollapsed={collapsed}
        triggerSubMenuAction={"hover"}
        selectable={false}
        selectedKeys={[]}
        onClick={handleMenuClick}
        items={menuItems}
      />
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
          <Checkbox onChange={handleChecked} checked={isArc}>
            This is an arc
          </Checkbox>
        </Modal>
        <Drawer
          className={"font-sans"}
          title={"Settings"}
          open={openSettingDrawer}
          onClose={() => setOpenSettingDrawer(false)}
          style={{ backgroundColor: "#f5f5f5" }}
          placement={"left"}
        >
          <p className={"flex justify-between"}>
            Auto Stabilization
            <Switch
              defaultChecked
              onChange={handleStabilizationToggle}
              className={"ml-2"}
            />
          </p>
          <Divider />
        </Drawer>
      </div>
    </div>
  );
};
export default ToolBar;
