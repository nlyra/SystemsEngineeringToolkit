const onSubmit = (e) => {
    e.preventDefault()
    if (!title || !type || !description) {
        setDialogText("Please enter all required fields.")
        handleOpenDialog()
        //alert('Please enter all required fields')
        return
    }

    if (type === 'Quiz' && JSON.parse(sessionStorage.getItem('quiz')) !== null) {
        console.log('works for Quiz')
        var quiz = []

        quiz = JSON.parse(sessionStorage.getItem("quiz"))
        sessionStorage.clear()
        onFinish({ title, type, description, quiz })
    } else if(type === 'PDF' && pdf !== null && typeof(pdf) !== 'undefined'){
        if(isPDF(pdf.name) === false){
            setDialogText("File must be a PDF.")
            handleOpenDialog()
            //alert("File must be a PDF")
        } else {
            console.log('works for PDF')
            onFinish({ title, type, description, pdf })
        }
    } else if(type === 'File' && file !== null && typeof(file) !== 'undefined'){
        console.log('works for File')
        onFinish({ title, type, description, file })
        
    } else if(type === 'Video' && video !== null && typeof(video) !== 'undefined'){
        if(isVideo(video.name) === false){
            setDialogText("File must be a video.")
            handleOpenDialog()
            //alert("File must be a video")
        } else {
            console.log('works for Video')
            onFinish({ title, type, description, video })
        }
    } else if (type === 'Text') {
        console.log('works for Text')
        onFinish({ title, type, description })
    }
    else {
        setDialogText("Please upload file for the respective module type selected.")
        handleOpenDialog()
        //alert("Please upload file for the respective module type selected.")
    }
}

// We ideally want to redirect to module manager page, but we do not have that yet
const cancel = () => {
    props.history.push(`/course/${courseID}`)
}

const onFinish = async (module) => {
    const token = localStorage.getItem("token");

    if (token !== undefined) {
        let res = undefined
        if (module.type === "Quiz") {
            res = await fetch(config.server_url + config.paths.newModule, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ 'token': token, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type, 'quiz': module.quiz, 'gradeToPass': gradeToPass })
            })

            const data = await res.json();
            if (data.message === "unauthorized") {
                props.history.push('dashboard');
            } else {
                setDialogText("Successfully added Quiz module")
                handleOpenDialog()
                //alert("Successfully added Quiz module")
                props.history.push('/course/' + courseID)
            }

        }else if(module.type === "PDF"){

            const pdfTypePath = module.pdf.name.split('.')

            // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
            var val = pdfTypePath[pdfTypePath.length - 2];
            var RegEx = /[^0-9a-z]/i;
            var isValid = !(RegEx.test(val));

            // Input contains non-alphanumeric values so we must alert the user to rename the file 
            if (isValid === false) {
                setDialogText("Invalid file type. Please upload a PDF for which name is alphanumeric and has no spaces.")
                handleOpenDialog()
                //alert('Invalid file type. Please upload a PDF for which name is alphanumeric and has no spaces.')
                return
            }

            if (data.message === "unauthorized") {
                props.history.push('dashboard');
            } else {
                setDialogText("Succesfully added Quiz module.")
                handleOpenDialog()
                //alert("Successfully added Quiz module")
                props.history.push('/course/' + courseID)
            }

            const newFile = new FormData();
            newFile.append('file', module.pdf)

            const res = await fetch(config.server_url + config.paths.newModule, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "token": token,
                    'courseID': courseID,
                    "title": module.title,
                    'description': module.description,
                    'type': module.type,
                    "urlFile": `http://localhost:4000/`+courseID+`/moduleData/${module.pdf.name}`
                })
            })
            const data = await res.json()
            if (data.message === "unauthorized") {
                props.history.push('dashboard');
            } else if (data.message === undefined) {
                const res = await fetch(config.server_url + config.paths.moduleFileUpload +"?token=" + token + "&courseID=" + courseID + "&imageName=" + module.pdf.name, {
                method: 'POST',
                body: newFile
                })
                const data2 = await res.json()

                if (data2.message === "unauthorized") {
                    props.history.push('dashboard');
                } else if (data2.status === 'Success') {
                    setDialogText("Successfully added PDF module.")
                    handleOpenDialog()
                    //alert("Successfully added PDF module")
                    props.history.push('/course/' + courseID)
                } //else need to do something, not sure what rn
            } else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        } else if(module.type === "File"){

            const fileTypePath = module.file.name.split('.')

            // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
            var val = fileTypePath[fileTypePath.length - 2];
            var RegEx = /[^0-9a-z]/i;
            var isValid = !(RegEx.test(val));

            // Input contains non-alphanumeric values so we must alert the user to rename the file 
            if (isValid === false) {
                setDialogText("Invalid file type. Please upload a file for which name is alphanumeric and has no spaces.")
                handleOpenDialog()
                //alert('Invalid file type. Please upload a file for which name is alphanumeric and has no spaces.')
                return
            }

            const newFile = new FormData();
            newFile.append('file', module.file)

            const res = await fetch(config.server_url + config.paths.newModule, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "token": token,
                    'courseID': courseID,
                    "title": module.title,
                    'description': module.description,
                    'type': module.type,
                    "urlFile": `http://localhost:4000/`+courseID+`/moduleData/${module.file.name}`
                })
            })
            const data = await res.json()
            if (data.message === "unauthorized") {
                props.history.push('dashboard');
            } else if (data.message === undefined) {
                const res = await fetch(config.server_url + config.paths.moduleFileUpload +"?token=" + token + "&courseID=" + courseID + "&imageName=" + module.file.name, {
                method: 'POST',
                body: newFile
                })
                const data2 = await res.json()

                if (data2.message === "unauthorized") {
                    props.history.push('dashboard');
                } else if (data2.status === 'Success') {
                    setDialogText("Successfully added File module.")
                    handleOpenDialog()
                    //alert("Successfully added File module")
                    props.history.push('/course/' + courseID)
                } //else need to do something, not sure what rn
            } else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        } else if (module.type === "Video") {

            const videoTypePath = module.video.name.split('.')

            // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
            var val = videoTypePath[videoTypePath.length - 2];

            var RegEx = /[^0-9a-z]/i;
            var isValid = !(RegEx.test(val));

            // Input contains non-alphanumeric values so we must alert the user to rename the file 
            if (isValid === false) {
                setDialogText("Invalid file type. Please upload a video for which name is alphanumeric and has no spaces.")
                handleOpenDialog()
                //alert('Invalid file type. Please upload a video for which name is alphanumeric and has no spaces.')
                return
            }

            const newVideo = new FormData();
            newVideo.append('file', module.video)
            const res = await fetch(config.server_url + config.paths.newModule, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "token": token,
                    'courseID': courseID,
                    "title": module.title,
                    'description': module.description,
                    'type': module.type,
                    "urlVideo": `http://localhost:4000/`+courseID+`/moduleData/${module.video.name}`,
                })

            })

            const data = await res.json()
            if (data.message === "unauthorized") {
                props.history.push('dashboard');
            } else if (data.message === undefined) {
                const res = await fetch(config.server_url + config.paths.moduleFileUpload + "?token=" + token + "&courseID=" + courseID + "&imageName=" + module.video.name, {
                method: 'POST',
                body: newVideo
                })
                const data2 = await res.json()

                if (data2.message === "unauthorized") {
                    props.history.push('dashboard');
                } else if (data2.status === 'Success') {
                    setDialogText("Successfully added video module.")
                    handleOpenDialog()
                    //alert("Successfully added video module")
                    props.history.push('/course/' + courseID)
                } //else need to do something, not sure what rn
            } else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        } else if (module.type === 'Text') {
            res = await fetch(config.server_url + config.paths.newModule, {

                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ 'token': token, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type })
            })

            const data = await res.json()

            if (data.message === "unauthorized") {
                props.history.push('dashboard');
            } else if (data.message === undefined) {
                setDialogText("Successfully completed action.")
                handleOpenDialog()
                //alert('worked')
                props.history.push('/course/' + courseID)
            }
            else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        }
    }
}