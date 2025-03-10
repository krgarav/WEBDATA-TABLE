import React, { use, useEffect, useState } from "react";
import { fetchHeadersInDuplicate } from "../../services/common";
import { useNavigate, useParams } from "react-router-dom";

const FindDuplicate = ({
  csvHeaders,
  imageNames,
  onFindDuplicatesHandler,
  onDuplicateCheckedHandler,
  duplicateCheckedData,
}) => {
  const [headers, setHeaders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("fileId"));
    async function fetchData() {
      const response = await fetchHeadersInDuplicate(data.templeteId);
      setHeaders(response.headers);
    }
    fetchData();
  }, []);

  const navigateHandler = () => {
    const data = JSON.parse(localStorage.getItem("fileId"));
    navigate(`/csvuploader/fieldDecision/${data.templeteId}`);
  };

  const editNavigateHandler = () => {
    const data = JSON.parse(localStorage.getItem("fileId"));
    navigate(`/csvuploader/templatemap/${id}`);
  };

  return (
    <div className="flex justify-center items-center w-[100%] pt-20 h-[100vh]">
      <div className=" w-[800px]">
        {/* MAIN SECTION  */}
        <section className="mx-auto w-full max-w-7xl  px-12 py-6 bg-white rounded-xl">
          <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-3xl font-semibold">Find Duplicates</h2>
            </div>
          </div>
          <div className="mt-6 mb-4 flex flex-col w-full">
            <div className="mx-4 -my-2  sm:-mx-6 lg:-mx-8">
              <div className="inline-block  py-2 align-middle md:px-6 lg:px-8">
                <div className=" border border-gray-200 md:rounded-lg ">
                  <div className="divide-y divide-gray-200 ">
                    <div className="bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="px-8 py-3.5 text-left text-xl font-semibold text-gray-700">
                          <span>Headers</span>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-white overflow-y-auto max-h-[300px] w-full">
                      {headers?.map((columnName, index) =>
                        columnName === "Previous Values" ||
                        columnName === "Updated Values" ||
                        columnName === "User Details" ||
                        columnName === "Updated Col. Name" ||
                        imageNames?.includes(columnName) ? null : (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div className="whitespace-nowrap px-4 py-4">
                              <div className="flex items-center">
                                <div className="ml-4 w-full font-semibold">
                                  <div className="px-2">{columnName}</div>
                                </div>
                              </div>
                            </div>
                            <div className="whitespace-nowrap px-4 py-4 text-right">
                              <button
                                onClick={() =>
                                  onFindDuplicatesHandler(columnName)
                                }
                                className="rounded-3xl border border-indigo-500 bg-indigo-500 px-10 py-1 font-semibold text-white"
                              >
                                Check
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
          <div className="text-right mt-2">
            <button
              onClick={() => {
                onDuplicateCheckedHandler(), setShowModal(true);
              }}
              class="group inline-block rounded-3xl bg-teal-500 p-[2px] text-white hover:bg-blue-600 focus:outline-none focus:ring active:text-opacity-75"
            >
              <span class="block  px-8 py-2 text-md font-medium group-hover:bg-transparent">
                Complete
              </span>
            </button>
          </div>
        </section>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className=" inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h1 className="text-xl  font-bold text-gray-500 mb-6">
                      Already Mapped Data
                    </h1>
                    <div className="text-gray-600 font-semibold my-2 overflow-y-auto h-[300px]">
                      <dl className="-my-3 divide-y divide-gray-100 text-sm">
                        {duplicateCheckedData?.records?.length > 0 ? (
                          duplicateCheckedData.records.map((data, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-1 py-3 text-center even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
                            >
                              <dt className="font-medium text-md text-gray-700 text-center">
                                {data?.key}
                              </dt>
                              <dd className="text-gray-700 font-medium sm:col-span-2 text-center">
                                {data?.value}
                              </dd>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center mt-10">
                            No records found.
                          </p>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={navigateHandler}
                  type="button"
                  className={`my-3 ml-3 w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-transparent px-4 py-2 bg-teal-600 text-base leading-6 font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                >
                  Submit
                </button>

                <button
                  onClick={editNavigateHandler}
                  type="button"
                  className=" my-3 w-full sm:w-auto inline-flex justify-center rounded-xl
         border border-transparent px-4 py-2 bg-gray-300 text-base leading-6 font-semibold text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDuplicate;
