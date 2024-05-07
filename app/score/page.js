'use client'
import { Button, Form, Input, Modal, Table, message } from "antd";
import { SearchOutlined, FileOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useRequest } from "ahooks";
import { createSC, getSCByid, pageQuerySC, removeSC, updateSC } from "@/lib/api/score";

const FormModal = forwardRef(({ refresh }, ref) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [id, SetId] = useState();

  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      if (!id) await createSC(values);
      else await updateSC(id, values);
      handleCancel();
      message.success("操作成功");
      refresh();
    } catch (error) {
      console.log(error);
      message.error("操作失败");
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    SetId(undefined);
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        setOpen(true);
        if (id) {
          SetId(id);
          getSCByid(id).then((data) => {
            form.setFieldsValue(data);
          });
        }
      },
    }),
    [form]
  );

  return (
    <Modal
      title={id ? "修改信息" : "添加成绩"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="取消"
      okText="保存"
      confirmLoading={confirmLoading}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="snum"
          label="学号"
          rules={[{ required: true, message: "学号不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cnum"
          label="课程号"
          rules={[{ required: true, message: "课程号不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="score"
          label="成绩"
          rules={[{ required: true, message: "成绩不能为空" }]}
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
    pageQuerySC(pageSize, page, form.getFieldValue('snum'), form.getFieldValue('cnum'))
  );

  const onFinish = () => {
    refresh();
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "删除成绩",
      content: "确定删除吗？一旦删除，无法恢复",
      okType: "danger",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await removeSC(id);
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
      title: "学号",
      dataIndex: "snum",
      align: "center",
    },
    {
      title: "学生姓名",
      dataIndex: "sname",
      align: "center",
    },
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
      title: "分数",
      dataIndex: "score",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <div className="flex-center gap-2 ">
          <Button type="link" onClick={() => modalRef.current?.show(record.id)}>
            修改
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.id)}>
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

        <Form.Item name="snum" label="学号">
          <Input />
        </Form.Item>
        <Form.Item name="cnum" label="课程号">
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
