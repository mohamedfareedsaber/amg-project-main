import { useState } from "react";

export default function Base({ categoryName, inputs, onSubmit }) {
  const [state, setState] = useState(
    inputs.reduce((acc, curr) => ({ ...acc, [curr.name]: "" }), {})
  );

  const handleSubmit = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault(); 
    }
    onSubmit(state);
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value })); // Update state with form input
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          {categoryName} Exam Results
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter the results for the {categoryName} exam
        </p>
      </div>

      <form className="px-6 py-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {inputs.map((input, key) => (
            <div key={key}>
              <label
                htmlFor={input.name}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {input.label}
              </label>
              <input
                type={input.type || "text"}
                id={input.name}
                name={input.name}
                placeholder={`Enter ${input.label} result`}
                onChange={handleInputChange} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}

       </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={() => setState(inputs.reduce((acc, curr) => ({ ...acc, [curr.name]: "" }), {}))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
