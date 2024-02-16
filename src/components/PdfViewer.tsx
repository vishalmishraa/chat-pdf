import React from "react";
import Iframe from 'react-iframe'

type Props = { pdf_url: string }; 

const PDFViewer = ({ pdf_url }: Props) => {
  
  return (
    // <Iframe
    //   src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
    //   className="w-full h-full"
    // />
    <Iframe url={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
    height="100%"
    width="100%"
    id=""
    className=""
    display="block"
    position="relative"/>
  );
};

export default PDFViewer;