import React, { useState } from 'react'
import { getApi } from '../../lib/api'


export default () => {
    const [pwdInput, setPwdInput] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        (async () => {
            e.preventDefault()
            const res = await getApi('pwd-check', { pwd: pwdInput })
            if (res.data.error) {
                setPwdInput('')
                alert('Incorrect password')
                return
            }
            alert('Password accepted')
    
            localStorage.setItem('align_pwd', pwdInput)
            location.replace('/')
        })()
    }

    return (
        <div className='container' style={ { marginTop: '50px'}}>
            <form onSubmit={handleSubmit} className='col-md'>
                <h2 className="text-center mb-4">Please input password</h2>
                <div className='input-group mb-3'>
                    <div className='input-group-prepend'>
                    <span className='input-group-text'>
                        Password
                    </span>
                    </div>
                    <input
                    type='text'
                    className='form-control'
                    value={pwdInput}
                    onChange={(e) => setPwdInput(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}