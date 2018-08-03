export default function getIconName(file) {
    const ext = file.split('.').pop()

    if (['jpg', 'png', 'bmp', 'JPG', 'jpeg', 'gif'].indexOf(ext) !== -1) {
        return 'attach-image'
    }

    if (['mp4', 'avi', '3gp', 'webm'].indexOf(ext) !== -1) {
        return 'attach-video'
    }

    if (['doc', 'docx'].indexOf(ext) !== -1) {
        return 'attach-doc'
    }

    if (['xls', 'xlsx'].indexOf(ext) !== -1) {
        return 'attach-xls'
    }

    if (['pdf'].indexOf(ext) !== -1) {
        return 'attach-pdf'
    }

    return 'attach-other'
}