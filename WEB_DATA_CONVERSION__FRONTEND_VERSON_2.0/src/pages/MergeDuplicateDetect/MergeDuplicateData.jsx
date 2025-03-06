import React, { useEffect, useState } from "react";
import img23 from "./img23.png";
import MergeEditDeleteDuplicate from "./MergeEditDeleteDuplicate";
import { useLocation } from "react-router-dom";
import MergeEditDuplicateData from "./MergeEditDuplicateData";
import axios from "axios";
import { REACT_APP_IP } from "../../services/common";

const MergeDuplicateData = () => {
  const [editmodel, setEditmodel] = useState(false);
  const [duplicate, setDuplicate] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [editViewModal,setEditViewModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const location = useLocation();
  const state = location.state;
  const {duplicates,header,templateId}=state;
  useEffect(() => {
    if (state) {
      setDuplicate(duplicates);
    }
  }, []);
  const duplicateViewHandler = async(item)=>{
    try {
      // console.log(header);
      // console.log(item[header])
      const obj = {colName:header,colValue:item[header],templateId};
      const res = await axios.post(`http://${REACT_APP_IP}:4000/viewDuplicates`,obj);
     
      if(res.data.success){
        setDuplicateData(res.data.duplicates)
        setEditmodel(true);
      }
      // console.log(res)
      // const res = 
    } catch (error) {
      
    }
    
  }
  const Duplicates = duplicate.map((item, index) => {
    return (
      <dl key={index} className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="flex justify-around gap-1 py-3 text-center even:bg-gray-50 sm:grid-cols-4">
          <dt className="font-medium text-md justify-center whitespace-normal items-center flex w-1/3">
           {item[header]}
          </dt>
          <dd className="font-medium items-center text-md w-1/3 flex justify-center">
           
           {item.count}
          </dd>
          <div className="w-1/3">
            <div className="relative">
              <div className="inline-flex items-center overflow-hidden rounded-2xl border bg-white">
                <button
                  className="border-e px-3 py-2 bg-blue-500 text-white text-sm/none hover:bg-gray-50 hover:text-gray-700"
                  onClick={()=>duplicateViewHandler(item)}

                  
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </dl>
    );
  });
  return (
    <>
    { !editViewModal&&
      <div className={`relative w-full h-screen ${editmodel ? "blur-sm" : ""}`}>
        <div className="w-[100%] pt-20 h-[100vh] bg-blue-500 lg:flex gap-10 xl:gap-80 px-5 justify-center">
          <div className="inline-block align-bottom mt-7 pb-6 lg:h-[85vh] bg-teal-100 rounded-xl lg:ms-4 text-left shadow-md overflow-hidden transform transition-all sm:align-middle w-4/12">
            <div className="px-4">
              <div className="sm:flex">
                <div className="text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex justify-between mt-4">
                    <h1 className="text-xl text-center font-bold mb-6 w-1/2">
                      Duplicates :<br />
                      <span className="text-lg font-medium text-blue-600">
                        duplicatesData
                      </span>
                    </h1>
                    <h1 className="text-xl text-center font-bold mb-6 w-1/2">
                      Field :<br />
                      <span className="text-lg font-medium text-blue-600">
                        {header}
                      </span>
                    </h1>
                  </div>
                  <div className="font-semibold my-2">
                    <dl className="-my-3 text-sm">
                      <div className="flex justify-around gap-1 py-3 font-bold even:bg-gray-50 sm:grid-cols-4 sm:gap-1 text-center w-full">
                        <dt className="text-md w-1/3">Name</dt>
                        <dd className="text-md w-1/3">Duplicates</dd>
                        <dd className="text-md w-1/3">View</dd>
                      </div>
                    </dl>
                  </div>
                  <div
                    className="font-semibold pb-4 overflow-y-auto h-[10vh] lg:h-[40vh] mt-7"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {Duplicates}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-5">
            <h1 className="text-white text-xl text-center mb-3">1 out of 1</h1>
            <img src={img23} alt="image" />
          </div> */}
        </div>
      </div>}

      {/* Modal Overlay */}
      {editmodel && !editViewModal  && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-2 w-3/4 relative">
            <button
              className="absolute top-2 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setEditmodel(false)}
            >
              ✖
            </button>
            <MergeEditDeleteDuplicate templateId={templateId} setEditModalData={setEditModalData} duplicateData={duplicateData} setEditViewModal={setEditViewModal} />
          </div>
        </div>
      )}

      {editViewModal &&(
        <MergeEditDuplicateData templateId={templateId} editModalData={editModalData}  setEditViewModal={setEditViewModal} />
      )}
    </>
  );
};

export default MergeDuplicateData;
