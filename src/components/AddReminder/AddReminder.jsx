/* global chrome */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AutoComplete, Button, Input, Tag, Typography, message } from "antd";
import { RocketOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { db, auth } from "../../firebase";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import "./AddReminder.scss";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const AddReminder = ({
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  addItem,
}) => {
  const [inputTitle, setInputTitle] = useState(title);
  const [inputDescription, setInputDescription] = useState(description);
  const [inputValue, setInputValue] = useState("");
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [userCreatedTags, setUserCreatedTags] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get("selectedText", (result) => {
        if (result.selectedText) {
          setInputTitle(result.selectedText);
        }
      });
    }
  }, []);

  useEffect(() => {
    fetchUserCreatedTags();
  }, []);

  const fetchUserCreatedTags = useCallback(async () => {
    try {
      const userTagsRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "userCreatedTags"
      );
      const q = query(userTagsRef);
      const snapshot = await getDocs(q);
      const fetchedTags = snapshot.docs.map((doc) => doc.data().tag);
      setUserCreatedTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching user created tags: ", error);
    }
  }, []);

  const addUserCreatedTag = useCallback(async (tag) => {
    try {
      const userTagsRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "userCreatedTags"
      );
      await addDoc(userTagsRef, { tag });
      setUserCreatedTags((prevTags) => [...prevTags, tag]);
    } catch (error) {
      console.error("Error adding user created tag: ", error);
    }
  }, []);

  const renderTitle = (title) => <span>{title}</span>;

  const renderItem = (title) => ({
    value: title,
    label: <div>{title}</div>,
  });

  const builtInOptions = useMemo(
    () => [
      {
        label: renderTitle(t("dates")),
        options: [
          renderItem(t("familyBirthday")),
          renderItem(t("weddingAnniversary")),
        ],
      },
      {
        label: renderTitle(t("goals")),
        options: [
          renderItem(t("personalGoals")),
          renderItem(t("professionalGoals")),
        ],
      },
      {
        label: renderTitle(t("insights")),
        options: [
          renderItem(t("books")),
          renderItem(t("stoicism")),
          renderItem(t("positiveAffirmations")),
        ],
      },
      {
        label: renderTitle(t("learning")),
        options: [
          renderItem(t("englishGrammar")),
          renderItem(t("englishWords")),
        ],
      },
      {
        label: renderTitle(t("yourTags")),
        options: userCreatedTags.map((tag) => renderItem(tag)),
      },
    ],
    [userCreatedTags, t]
  );

  const [options, setOptions] = useState(builtInOptions);

  const handleInputChange = useCallback(
    (e) => {
      const { value } = e.target;
      if (value.endsWith(",") || e.key === "Enter") {
        const newTag = value.replace(",", "").trim();
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
          if (!userCreatedTags.includes(newTag)) {
            addUserCreatedTag(newTag);
          }
        }
        setInputValue("");
      } else {
        setInputValue(value);
      }
    },
    [tags, userCreatedTags, addUserCreatedTag, setTags]
  );

  const handleTagClose = useCallback(
    (removedTag) => {
      setTags(tags.filter((tag) => tag !== removedTag));
    },
    [tags, setTags]
  );

  const handleSelect = useCallback(
    (value) => {
      if (!tags.includes(value)) {
        setTags([...tags, value]);
      }
      setInputValue("");
    },
    [tags, setTags]
  );

  const filterOptions = useCallback(
    (searchText) => {
      if (!searchText) {
        setOptions(builtInOptions);
        return;
      }

      const filteredOptions = builtInOptions
        .map((group) => {
          const filteredGroupOptions = group.options.filter((option) =>
            option.value.toLowerCase().includes(searchText.toLowerCase())
          );

          return {
            ...group,
            options: filteredGroupOptions,
          };
        })
        .filter((group) => group.options.length > 0);

      setOptions(filteredOptions);
    },
    [builtInOptions]
  );

  const handleAddItem = async () => {
    if (inputTitle && inputDescription && tags.length > 0) {
      setIsPosting(true);
      setTitle(inputTitle);
      setDescription(inputDescription);
      await addItem(inputTitle, inputDescription, tags);
      setInputTitle("");
      setInputDescription("");
      setTags([]);
      setIsPosting(false);
      setIsPosted(true);
      setTimeout(() => setIsPosted(false), 2000);
    } else {
      message.error(t("fillAllFields"));
    }
  };

  return (
    <div className="add-reminder-form">
      <h2>{t("writeWhatYouWantToMemorize")}</h2>

      <p className="add-reminder-paragraph">
        <span>&#10551;</span> {t("addRemindersHere")}
      </p>
      <p className="add-reminder-paragraph">
        <span>&#10551;</span> {t("useTagsToOrganize")}
      </p>

      <div className="notification-preview">
        {!titleFocused ? (
          <div
            className="notification-field"
            onClick={() => setTitleFocused(true)}
          >
            <Text strong className="notification-title">
              {inputTitle || t("titleOfYourReminder")}
            </Text>
            <EditOutlined className="edit-icon" />
          </div>
        ) : (
          <Input
            placeholder={t("titlePlaceholder")}
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value.slice(0, 30))}
            className="input-field"
            onBlur={() => setTitleFocused(false)}
            autoFocus
          />
        )}
        {!descriptionFocused ? (
          <div
            className="notification-field"
            onClick={() => setDescriptionFocused(true)}
          >
            <Text className="notification-description">
              {inputDescription || t("descriptionPlaceholder")}
            </Text>
            <EditOutlined className="edit-icon" />
          </div>
        ) : (
          <Input.TextArea
            placeholder={t("descriptionPlaceholder")}
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value.slice(0, 100))}
            className="input-field"
            onBlur={() => setDescriptionFocused(false)}
            autoFocus
          />
        )}
      </div>

      <div className="tags-container">
        {tags.map((tag, index) => (
          <Tag
            key={index}
            closable
            onClose={() => handleTagClose(tag)}
            className="tag-item"
          >
            {tag}
          </Tag>
        ))}

        <AutoComplete
          popupClassName="certain-category-search-dropdown"
          popupMatchSelectWidth={"auto"}
          onSearch={filterOptions}
          options={options}
          value={inputValue}
          onSelect={handleSelect}
          onChange={setInputValue}
          onKeyDown={handleInputChange}
        >
          <Input
            size="small"
            onChange={handleInputChange}
            placeholder={t("tagsPlaceholder")}
            value={inputValue}
            className="input-field"
          />
        </AutoComplete>
      </div>
      <div className="add-reminder-button">
        <Button
          className={`primary-confirmation-button ${isPosted ? "success" : ""}`}
          htmlType="submit"
          type="primary"
          onClick={handleAddItem}
          icon={isPosted ? <CheckOutlined /> : <RocketOutlined />}
          disabled={
            isPosting || !inputTitle || !inputDescription || tags.length === 0
          }
        >
          {isPosted ? t("added") : t("add")}
        </Button>
      </div>
    </div>
  );
};

export default AddReminder;
