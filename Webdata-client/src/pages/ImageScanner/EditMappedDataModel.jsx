import React, { useEffect, useState } from 'react'
import HeaderData from '../TemplateMapping/HeaderData';
import HeaderMappedReview from '../TemplateMapping/HeaderMappedReview';
import { useNavigate, useParams } from 'react-router-dom';
import { checkMappedDataExits, fetchHeadersInDuplicate, onGetTemplateHandler, submitMappedData } from '../../services/common';

const EditMappedDataModel = ({ isOpen, onClose }) => {

    if (!isOpen) return null; // Don't render if modal is not open

      const [csvHeaders, setCsvHeaders] = useState([]);
      const [templateHeaders, setTemplateHeaders] = useState();
      const [selectedAssociations, setSelectedAssociations] = useState({});
      const [showModal, setShowModal] = useState(false);
      const [submitLoading, setSubmitLoading] = useState(false);
    
      const navigate = useNavigate();
      let { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";
      let token = JSON.parse(localStorage.getItem("fileId"));

      useEffect(()=>{
        const fetchTemplate = async () => {
            try {
              const response = await checkMappedDataExits(token.templeteId);
              console.log(response.records)
            } catch (error) {
              console.log(error);
            }
          };
          fetchTemplate();
      },[])
    
    //   useEffect(() => {
    //     const fetchTemplate = async () => {
    //       try {
    //         const response = await onGetTemplateHandler();
    //         const templateData = response?.find((data) => data.id == id);
    //         for (let i = 1; i <= templateData.pageCount; i++) {
    //           templateData.templetedata.push({ attribute: `Image${i}` });
    //         }
    //         // templateData.templetedata.push({ attribute: "Image" });
    //         setTemplateHeaders(templateData);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
    //     fetchTemplate();
    //   }, [id]);

    
    //   useEffect(() => {
    //     const data = JSON.parse(localStorage.getItem("fileId"));
    //     async function fetchData() {
    //       const response = await fetchHeadersInDuplicate(data.templeteId);
    //       setCsvHeaders(response.headers);
    //     }
    //     fetchData();
    //   }, []); // useEffect(() => {
      //   const fetchData = async () => {
      //     try {
      //       const response = await axios.get(
      //         `${window.SERVER_IP}/get/headerdata/${fileId}`,
      //         {
      //           headers: {
      //             token: token,
      //           },
      //         }
      //       );
      //       console.log("rowData", response);
      //       localStorage.setItem(
      //         "totalData",
      //         JSON.stringify(response.data.rowCount)
      //       );
      //       setCsvHeaders(response.data.headers);
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   };
      //   fetchData();
      // }, [fileId, token]);
    
      const handleCsvHeaderChange = (csvHeader, index) => {
        const updatedAssociations = { ...selectedAssociations };
        updatedAssociations[csvHeader] = index;
        setSelectedAssociations(updatedAssociations);
    
        csvHeaders.forEach((header) => {
          if (!(header in updatedAssociations)) {
            updatedAssociations[header] = "";
          }
        });
    
        setSelectedAssociations(updatedAssociations);
      };
    
      const handleTemplateHeaderChange = (csvHeader, templateHeader) => {
        const updatedAssociations = { ...selectedAssociations };
    
        if (templateHeader.includes("--")) {
          const [min, max] = templateHeader.split("--");
          const newMin = parseInt(min);
          const newMax = parseInt(max);
          // Loop through all headers
    
          Object.keys(selectedAssociations).forEach((header) => {
            const questionNumber = parseInt(header.replace(/\D/g, ""));
            if (questionNumber >= newMin && questionNumber <= newMax) {
              updatedAssociations[header] = templateHeader;
            }
          });
        } else if (templateHeader === "UserFieldName") {
          updatedAssociations[csvHeader] = "";
        } else {
          updatedAssociations[csvHeader] = templateHeader;
        }
        // Ensure all headers are included in updatedAssociations
        csvHeaders.forEach((header) => {
          if (!(header in updatedAssociations)) {
            updatedAssociations[header] = "";
          }
        });
    
        setSelectedAssociations(updatedAssociations);
      };
    
      const onMapSubmitHandler = async () => {
        const mappedvalues = Object.values(selectedAssociations);
    
        for (let i = 1; i <= templateHeaders.pageCount; i++) {
          if (!mappedvalues.includes(`Image${i}`)) {
            toast.error("Please select all the field properly.");
            return;
          }
        }
        setSubmitLoading(true);
        const associationData = [];
        const obj = { ...selectedAssociations };
        for (let i = 0; i < csvHeaders.length; i++) {
          const header = csvHeaders[i];
          if (obj.hasOwnProperty(header)) {
            associationData.push({
              key: header,
              value: obj[header],
            });
          }
        }
    
        const mappedData = {
          associationData: associationData,
          fileId: fileId,
        };
    
        try {
          const response = await submitMappedData(mappedData)
          if(response.success){
            toast.success("Mapping successfully done.");
            navigate(`/csvuploader/fieldDecision/${id}`);
          } else {
            toast.error("Something went wrong")
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSubmitLoading(false);
        }
      }; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
        <div className='flex justify-between items-start'>
        <h1 className="text-blue-800 text-4xl text-center mb-10">Mapping</h1>
        <button onClick={onClose} className='text-3xl text-red-500 font-bold'>X</button>
        </div>
        <HeaderData
          csvHeaders={csvHeaders}
          handleTemplateHeaderChange={handleTemplateHeaderChange}
          templateHeaders={templateHeaders}
          selectedAssociations={selectedAssociations}
          handleCsvHeaderChange={handleCsvHeaderChange}
        />
        <HeaderMappedReview
          onMapSubmitHandler={onMapSubmitHandler}
          setShowModal={setShowModal}
          showModal={showModal}
          selectedAssociations={selectedAssociations}
          submitLoading={submitLoading}
        />
      </div>
    </div>
  )
}

export default EditMappedDataModel
