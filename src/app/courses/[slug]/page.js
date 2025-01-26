"use client";
import {
  createOrUpdateCourse,
  getCourse,
} from "@/app/api/handlers/handleCourses";
import { getUser } from "@/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/helper/date";
import Header from "@/Components/Header";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

function EditCourse({ course, getCourseForUser }) {
  const [courseName, setCourseName] = useState(course.courseName);
  const [description, setDescription] = useState(course.description)

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedCourse = {
      ...course,
      _id: course._id,
      courseName,
      description,
    };

    let res = await createOrUpdateCourse(
      stringifyObject({ ...updatedCourse })
    );
    if (parseString(res).status === 200) {
      getCourseForUser();
      message.success("Course Updated Successfully");
    } else {
      message.error("Failed to update course");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <label>Course Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function Course() {
  const { slug } = useParams();
  const user = getUser();
  const [course, setCourse] = useState(null);
  const [tabItems, setTabItems] = useState(null);
  const navigate = useRouter();

  const handleDeleteCourse = async () => {
    let res = await axios.get(`/api/courses/delete/${slug}`);
    if(res.status===200){
      message.success("Course deleted successfully");
      navigate.push("/courses");
      
    }
  
  }

  const getCourseForUser = async () => {
    let res = await getCourse(stringifyObject({ user, id: slug }));
    if (parseString(res).status === 200) {
      let data = JSON.parse(res).data;
      setCourse(data);
    }
  };

  const onChange = (key) => {
    // console.log(key);
  };

  useEffect(() => {
    if (!course) {
      return;
    }

    let jsx = (
      <div>
        <Title>{course.courseName}</Title>
        <Paragraph>
          <Text strong>Type:</Text> {course.type}
        </Paragraph>
        <Paragraph>
          <Text strong>Course Description:</Text> {course.description}
        </Paragraph>
      </div>
    );

    const items = [
      {
        key: "1",
        label: "Course Data",
        children: jsx,
      },
      {
        key: "2",
        label: "Edit",
        children: <EditCourse course={course} getCourseForUser={getCourseForUser} />,
      },
      {
        key: "3",
        label: "Delete",
        children: <div>
          <Button type="primary" danger onClick={handleDeleteCourse}>Delete Course</Button>
        </div>,
      },
    ];

    setTabItems(items);

  }, [course]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getCourseForUser();
  }, [slug, user]);
  return (
    <div>
      <Header />
      <br />
      {course && (
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      )}
      {!course && <Title>Loading...</Title>}
    </div>
  );
}

export default Course;
