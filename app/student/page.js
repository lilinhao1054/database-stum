'use client'
import { Button, Form, Input, Modal, Table, message } from "antd";
import { SearchOutlined, FileOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useRequest } from "ahooks";
import { createStudent, getStudentBySnum, pageQueryStudent, removeStudent, updateStudent } from "@/lib/api/student";

const FormModal = forwardRef(({ refresh }, ref) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [snum, setSnum] = useState();

  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      if (!snum) await createStudent(values);
      else await updateStudent(snum, values);
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
    setSnum(undefined);
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      show: (snum) => {
        setOpen(true);
        if (snum) {
          setSnum(snum);
          getStudentBySnum(snum).then((data) => {
            console.log(data);
            form.setFieldsValue(data);
          })
        }
      },
    }),
    [form]
  );

  return (
    <Modal
      title={snum ? "修改信息" : "添加学生"}
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
          name="sname"
          label="姓名"
          rules={[{ required: true, message: "姓名不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="年龄"
          rules={[{ required: true, message: "年龄不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sex"
          label="性别"
          rules={[{ required: true, message: "请选择性别" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="major"
          label="专业"
          rules={[{ required: true, message: "专业不能为空" }]}
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
    pageQueryStudent(pageSize, page, form.getFieldValue('sname'))
  );


  const onFinish = () => {
    refresh();
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleDelete = (snum) => {
    Modal.confirm({
      title: "删除学生",
      content: "确定删除吗？一旦删除，无法恢复",
      okType: "danger",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await removeStudent(snum);
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
      title: "姓名",
      dataIndex: "sname",
      align: "center",
    },
    {
      title: "年龄",
      dataIndex: "age",
      align: "center",
    },
    {
      title: "性别",
      dataIndex: "sex",
      align: "center",
      render: (sex) => sex === '0' ? '男' : '女'
    },
    {
      title: "专业",
      dataIndex: "major",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      render: (_, record) => (
        <div className="flex-center gap-2 ">
          <Button type="link" onClick={() => modalRef.current?.show(record.snum)}>
            修改
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.snum)}>
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

        <Form.Item name="sname" label="学生姓名">
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
