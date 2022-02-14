import dynamic from "next/dynamic";

export default dynamic(() => import('@mantine/rte'), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});

// const AssignmentDescriptionEditor = dynamic(
//   import('react-quill'), { ssr: false, loading: function loading() { return <p>Loading ...</p> }}
// )

// AssignmentDescriptionEditor.displayName = 'AssignmentDescriptionEditor';

// export default AssignmentDescriptionEditor;