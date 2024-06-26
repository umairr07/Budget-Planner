import { useEffect, useReducer } from "react";
// import { v4 as uuid } from "uuid";

const initialState = {
  budget: 2000,
  spent: 0,
  remainigBudget: 2000,
  inputText: "",
  inputNumber: 0,
  expenseArray: [],
};

const reducerFun = (state, action) => {
  switch (action.type) {
    case "saveBudget": {
      return {
        ...state,
        remainigBudget: state.remainigBudget - state.inputNumber,
        spent: state.spent + state.inputNumber,
        inputNumber: "",
        inputText: "",
        expenseArray: [...state.expenseArray, { ...action.payload }],
      };
    }
    case "deleteExpense": {
      let filter = state.expenseArray.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        expenseArray: [...filter],
        remainigBudget: state.remainigBudget + action.payload.cost,
        spent: state.spent - action.payload.cost,
      };
    }
    case "inputNumber": {
      return {
        ...state,
        inputNumber: action.payload,
      };
    }
    case "inputText": {
      return {
        ...state,
        inputText: action.payload,
      };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(
    reducerFun,
    JSON.parse(localStorage.getItem("expenses")) || initialState
  );

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state));
  }, [state]);

  const handleDelete = (id, cost) => {
    // console.log(id, cost);
    dispatch({ type: "deleteExpense", payload: { id, cost } });
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl text-center font-bold my-5">
          My Budget Planner
        </h1>
      </div>

      <div className=" flex justify-around my-10">
        <p className=" p-5 text-xl rounded-lg bg-[#fff] shadow-lg">
          Budget:{" "}
          <span className="text-green-500 font-bold">Rs {state.budget}</span>
        </p>
        <p className="p-5 text-xl rounded-lg bg-[#fff] shadow-lg">
          Budget Remainig:{" "}
          <span className="text-[#38dbff] font-bold">
            Rs {state.remainigBudget}
          </span>
        </p>

        <p className="p-5 text-xl rounded-lg bg-[#fff] shadow-lg">
          Spent so far:{" "}
          <span className="text-red-500 font-bold">Rs {state.spent}</span>
        </p>
      </div>

      <div className="flex gap-10 justify-center items-center w-[900px] m-auto">
        <div>
          <p className="font-semibold text-xl">Name</p>
          <input
            type="text"
            className="border-2 w-[400px] p-2 rounded-lg my-2"
            value={state.inputText}
            onChange={(e) =>
              dispatch({ type: "inputText", payload: e.target.value })
            }
          />
        </div>
        <div>
          <p className="font-semibold text-xl">Cost</p>
          <input
            type="number"
            className="border-2 w-[400px] p-2 rounded-lg my-2"
            value={state.inputNumber}
            onChange={(e) =>
              dispatch({
                type: "inputNumber",
                payload: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <button
            onClick={() =>
              dispatch({
                type: "saveBudget",
                payload: {
                  name: state.inputText,
                  cost: parseInt(state.inputNumber),
                  id: Date.now(),
                },
              })
            }
            className="border-2 p-2 w-[80px] mt-6 bg-[#1b8efa] rounded-lg text-white font-semibold hover:bg-[#6db5f8] hover:text-white"
          >
            Save
          </button>
        </div>
      </div>

      <div>
        {state.spent === 0 ? (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold ml-28 py-2 text-center">
              No data in the Expense list...
            </h1>
          </div>
        ) : (
          <div className="">
            <h1 className="text-2xl font-semibold  py-2 text-center mt-10">
              Expense List
            </h1>
            {state.expenseArray.map((item) => {
              return (
                <div className="my-8 " key={item.name}>
                  <div className="flex justify-between border-2 w-[65%] p-2 m-auto bg-[#fff] rounded-lg">
                    <h1>{item.name}</h1>
                    <div className="flex gap-3 justify-center items-center mr-5">
                      <h1>{item.cost}</h1>
                      <h1>{state.id}</h1>
                      <p
                        className="cursor-pointer"
                        onClick={() => handleDelete(item.id, item.cost)}
                      >
                        x
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
