import { Code, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Alert from "../ui/AlertDailog";
import { publishResult, deleteQuestion, getUserQuestions } from "../services/ApiService";

function Programming() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [show, setShow] = useState();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    setShow(sets.length === 0);
  }, [sets]);

  const loadQuestions = async () => {
    const data = await getUserQuestions("programming");
    setSets(data);
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion("programming", selectedSet.id);
      setSets((prev) => prev.filter((q) => q.id !== selectedSet.id));
      setShowConfirm(false);
    } catch {
      // Handle error
    }
  };

  const handlePublish = async (set) => {
    try {
      await publishResult("programming", set.id, true);
      setSets((prev) => prev.map((q) => (q.id === set.id ? { ...q, display_result: 1 } : q)));
    } catch {
      // Handle error
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div
        className={`${
          !show ? "flex justify-between items-center p-2" : "p-8 text-center flex flex-col items-center"
        } bg-white mb-6 rounded-xl shadow-lg transition-all duration-500 animate-slide-up`}>
        {show && <Code className="mx-auto text-green-500 mb-4 animate-fade-in" size={64} />}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in">Programming Sets</h2>
        {show && <p className="text-gray-600 mb-6 animate-fade-in">Manage programming questions and sets</p>}
        <button
          className={
            "bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition px-6 py-3 shadow-lg transform hover:scale-105 animate-fade-in"
          }
          onClick={() => navigate("/dashboard/add-question/programming")}>
          <Plus className="inline mr-2" size={16} />
          Add Question
        </button>
      </div>
      {sets.length === 0 ? (
        <p className="text-gray-500 text-center mt-8 animate-fade-in">No programming sets found.</p>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {sets.map((set, idx) => (
            <div
              key={set.id}
              className="transition-all duration-500 transform animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}>
              <QuestionCard
                id={set.id}
                title={set.title}
                description={set.description}
                dueDate={set.due_date}
                totalMarks={set.totalMarks}
                published={!!set.display_result}
                type="programming"
                onEdit={() => navigate(`/dashboard/programming/edit/${set.id}`)}
                onView={() => navigate(`/answers/programming/${set.id}`)}
                onPublish={() => handlePublish(set)}
                onDelete={() => {
                  setSelectedSet(set);
                  setShowConfirm(true);
                }}
              />
            </div>
          ))}
        </div>
      )}
      <Alert
        isVisible={showConfirm}
        text="Are you sure you want to delete this question?"
        type="warning"
        onResult={(result) => {
          if (result) handleDelete();
          else setShowConfirm(false);
        }}
      />
    </div>
  );
}

export default Programming;
