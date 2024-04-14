
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Delta from 'quill-delta';
import toast from 'react-hot-toast';
import AppContext from '../../context/AppContext';
import QuillCursors from 'quill-cursors';
import Loader from '../../utils/Loader';

Quill.register('modules/cursors', QuillCursors);

function TextEditor({ socket, setsocket }) {
    const { toastOptions, generateRandomColor, userData } = useContext(AppContext)
    const [value, setValue] = useState('');
    const [documentState, setdocumentState] = useState({});
    const quillRef = useRef('')
      const [loading, setloading] = useState(true)
      const [textSave, settextSave] = useState(null)
    const { roomId } = useParams();
    // const roomId='ekdsa3d'
    const id = Math.floor(Math.random() * 100)
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ align: [] }],
            ["image", "blockquote", "code-block"],
            ["clean"],
        ],
        cursors: {
            hideDelayMs: 500,
            hideSpeedMs: 300,
            selectionChangeSource: null,
            transformOnTextChange: true
        },
    };



    useEffect(() => {
        const socketInstance = io(import.meta.env.VITE_SERVER)
        setsocket(socketInstance)
        socketInstance.emit('join-room', { roomId, data: userData })
        return () => {
            socketInstance.disconnect()
        }
    }, [])


    useEffect(() => {
        const handleTextChange = (delta, oldDelta, source) => {
            if (source != 'user') return;
            let range = quillRef.current.getEditor()?.getSelection();
            // console.log(range);
            if (range) {
                if (range.length == 0) {
                    socket?.emit('cursor-move', { roomId, data: userData, cursorPos: range });
                    socket?.emit('text-change', { roomId, delta: delta })
                    settextSave(false)
                } else {
                    const currentContents = quillRef.current.getEditor()?.getContents(); // Get the current state of the editor
                const serializedContent = JSON.stringify(currentContents); // Serialize the state
                socket?.emit('save-content', { roomId, content: serializedContent });
                settextSave(true);
                    console.log('User has made a selection');
                }
            }

            
            // console.log("here text");
        }

        const handleTextSelection = (range) => {
            console.log("here select");
            socket?.emit('cursor-selection', { roomId, data: userData, cursorPos: range })
            console.log("bold");
        }

        socket?.on('remote-cursor-move', ({ data, cursorPos }) => {
            console.log("here remote select");
            // const color = generateRandomColor()
            const id=data?._id
            const cursors = quillRef.current.getEditor().getModule("cursors")
            cursors.moveCursor(id, cursorPos)
            cursors.toggleFlag(id, true);

        })
        socket?.on('remote-cursor-selection', ({ data, cursorPos }) => {
            console.log("here remote select");
            const color = data?.avatar?.bgColor
            const id=data?._id
            const cursors = quillRef.current.getEditor().getModule("cursors")
            // const allCursors = cursors.cursors
            // if (!allCursors.some(cursor => cursor.id == id)) {
            cursors.createCursor(id, data?.fullName, color)
            // }

            cursors.moveCursor(id, cursorPos)
            cursors.toggleFlag(id, true);

        })
        quillRef.current.getEditor()?.on('text-change', handleTextChange)
        quillRef.current.getEditor()?.on('selection-change', (range, oldRange, source) => {
            handleTextSelection(range)
        })

        return () => {
            // quillRef.current.getEditor()?.off('text-change',handleTextChange)
            // quillRef.current.getEditor()?.off('selection-change')
        }
    }, [socket])




    useEffect(() => {
        socket?.on('initialize-content', (content) => {
            //console.log("Received document state:", content);
            const delta = new Delta(content);
            if (typeof content === 'object' && content !== null) {
                setloading(false)
              quillRef.current.getEditor().setContents(delta, 'silent');
            } 
            else {
              console.error('Document state is neither a string nor a valid object:', documentState);
              quillRef.current.getEditor().setText('Failed to load document.');
            }
            quillRef.current.getEditor().enable();
          });

        socket?.on('text-change', (data) => {
            console.log("remote text here");
            const delta = new Delta(data.delta)
            quillRef.current.getEditor().updateContents(delta, 'silent')
            console.log("ON text-change " + JSON.stringify(delta));
        })


        socket?.on('user-joined', (data) => {
            if (typeof socket === 'undefined') return;
            // setClients(prev => [...prev, username]);

            const color = data?.avatar?.bgColor;
            const cursors = quillRef.current.getEditor()?.getModule("cursors");
            const allCursors = cursors.cursors();
            // console.log("All available cursors " + JSON.stringify(allCursors));
            if (!allCursors.some(cursor => cursor.id === data?._id)) {
                cursors.createCursor(data?._id, data?.fullName, color);
            }
        });

        socket?.on('user-leave', (data) => {      
            const cursors = quillRef.current.getEditor()?.getModule("cursors");
            cursors.removeCursor(data?._id, data?.fullName);
          });

        return () => {
            socket?.off('text-change');
            socket?.off('user-joined')
            socket?.off('user-leave')
            socket?.off('initialize-content')
            // socket?.disconnect();
            //     if(quillRef.current)               //object exists
            //       quillRef.current.getEditor().off('text-change');
            //     console.log("Cleaned up on component unmount");
        };
    }, [socket])

    useEffect(() => {
        console.log(documentState);

    }, [documentState])
    
    
    const timer = useRef('')
    const handleKeyUp = (e) => {
        clearTimeout(timer.current); // Clear the previous timer
        timer.current= setTimeout( () =>{
            
            // Typing has stopped, perform your action here
            if (quillRef.current) {
                const currentContents = quillRef.current.getEditor()?.getContents(); // Get the current state of the editor
                const serializedContent = JSON.stringify(currentContents); // Serialize the state
                socket.emit('save-content', { roomId, content: serializedContent });
                settextSave(true);
              }
            console.log('User stopped typing ' + e.key);
          }, 1000);

          
    }

    


    return (
        <div className="mt-4 mr-5 p-3 relative " style={{ height: "90vh" }} >
        {loading && <Loader/>}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                className='h-full bg-gray-200 overflow-hidde px-2  rounded-md border-gray-600'
                value={value}
                placeholder='start collaborating . .'
                modules={modules}
                onKeyUp={handleKeyUp}
                onChange={setValue} />
                {textSave!==null &&
                <div>
                {textSave==true ? 
                <div className="p-2 text-base animate__animated text-lime-200/100 animate__fadeIn animate__slow">saved ✔</div>
                :
                <div className="p-2 text-base text-gray-300/80 "> saving <span className="animate__animated animate__bounce animate__infinite animate__flash animate__slow">. . .</span></div>
                }
                </div>
                }
        </div>
    )
}
export default TextEditor