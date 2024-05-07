'use client'
import { Button, Form, Input, Modal, Table, message } from "antd";
import { SearchOutlined, FileOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useRequest } from 'ahooks';
import { createCourse, getCourseByCnum, pageQueryCourse, removeCourse, updateCourse } from "@/lib/api/course";

const FormModal = forwardRef(({ refresh }, ref) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [cnum, setCnum] = useState();

  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      if (!cnum) await createCourse(values);
      else await updateCourse(cnum, values);
      handleCancel();
      message.success("操作成功");
      refresh();
    } catch (error) {
      console.log(error);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setCnum(undefined);
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      show: (cnum) => {
        setOpen(true);
        if (cnum) {
          setCnum(cnum);
          getCourseByCnum(cnum).then((data) => {
            form.setFieldsValue(data);
          });
        }
      },
    }),
    [form]
  );

  return (
    <Modal
      title={cnum ? "修改信息" : "添加课程"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="保存"
      confirmLoading={confirmLoading}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="cnum"
          label="课程号"
          rules={[{ required: true, message: "课程号不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cname"
          label="课程名称"
          rules={[{ required: true, message: "课程名不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="hours"
          label="学时"
          rules={[{ required: true, message: "学时不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="credit"
          label="学分"
          rules={[{ required: true, message: "学分不能为空" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
});

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [form] = Form.useForm();

  const { data, loading, refresh } = useRequest(() =>
    pageQueryCourse(pageSize, page, form.getFieldValue("cname"))
  );

  const onFinish = () => {
    refresh();
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleDelete = (cnum) => {
    Modal.confirm({
      title: "删除课程",
      content: "确定删除吗？一旦删除，无法恢复",
      okType: "danger",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await removeCourse(cnum);
          message.success("删除成功");
          refresh();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const columns = [
    {
      title: "课程号",
      dataIndex: "cnum",
      align: "center",
    },
    {
      title: "课程名称",
      dataIndex: "cname",
      align: "center",
    },
    {
      title: "学时",
      dataIndex: "hours",
      align: "center",
    },
    {
      title: "学分",
      dataIndex: "credit",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <div className="flex-center gap-2 ">
          <Button type="link" onClick={() => modalRef.current?.show(record.cnum)}>
            修改
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.cnum)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const modalRef = useRef();

  return (
    <div className="flex flex-col gap-4">
      <Form
        form={form}
        onFinish={onFinish}
        className="bg-white w-full rounded-lg p-4"
      >
        <div className="flex mb-4">
          <div className="flex items-center gap-1 text-lg">
            <SearchOutlined />
            筛选搜索
          </div>
          <Button className="ml-auto" htmlType="button" onClick={onReset}>
            重置
          </Button>
          <Button className="ml-4" type="primary" htmlType="submit">
            查询结果
          </Button>
        </div>

        <Form.Item name="cname" label="课程名称">
          <Input />
        </Form.Item>
      </Form>

      <div className="flex bg-white w-full rounded-lg p-4">
        <div className="flex items-center gap-1 text-lg">
          <FileOutlined />
          数据列表
        </div>
        <Button className="ml-auto" onClick={() => modalRef.current?.show()}>
          添加
        </Button>
      </div>

      <Table
        bordered
        pagination={{
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          pageSizeOptions: ["5", "10"],
          pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        columns={columns}
        dataSource={data?.records}
        loading={loading}
      />
      <FormModal ref={modalRef} refresh={refresh} />
    </div>
  );
};

export default Page;
