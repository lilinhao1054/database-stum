'use client'
import { useEffect, useState } from "react";
import { Layout, Menu, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import "./globals.css";
import { useRouter } from "next/navigation";

const { Header, Content, Sider } = Layout;

const RootLayout = ({ children }) => {
  // menu
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  useEffect(() => {
    const selectedKey = localStorage.getItem("selectedKey");
    if (selectedKey != null) {
      setSelectedKeys([selectedKey]);
    } else {
      setSelectedKeys(["1"]);
    }
  }, []);

  const router = useRouter();

  return (
    <html lang="en">
      <body >
        <Layout className="h-screen">
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKeys}
              onClick={({ key }) => {
                setSelectedKeys([key]);
                localStorage.setItem("selectedKey", key);
                if (key === "1") {
                  router.push("/student");
                } else if (key === '2') {
                  router.push("/course");
                } else {
                  router.push("/score");
                }
              }}
              items={[
                {
                  key: "1",
                  label: "学生管理",
                },
                {
                  key: "2",
                  label: "课程管理",
                },
                {
                  key: "3",
                  label: "成绩管理",
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: "#fff",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content>
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html >
  );
};

export default RootLayout;