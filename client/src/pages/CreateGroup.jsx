import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import React from 'react'

export default function CreateGroup() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'> Create a Group</h1>
      <form>
          <div>
            <Label htmlFor='groupName' value='Group Name' className='mt-4 flex'/>
            <TextInput type="text" label='Group Name' placeholder='Enter group name' required id="name" className='flex-1'/>
          </div>
          <div>
            <Label htmlFor='groupDescription' value='Group Description' className='mt-4 flex'/>
            <Textarea type="text" label='Group Description' placeholder='Describe your group' required id="description" className='flex-1'/>
          </div>
          <Button type="submit" gradientDuoTone='purpleToBlue' className='mt-10 flex w-full'>
               Create Group
            </Button>
        </form>
    </div>
  )
}
