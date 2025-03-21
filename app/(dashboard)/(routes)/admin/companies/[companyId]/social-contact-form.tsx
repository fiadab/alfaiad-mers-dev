"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Globe, Linkedin, MailIcon, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Company } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialContactsFormProps{
    initialData : Company,
    companyId : string;
}

const formSchema = z.object({
    mail  : z.string().min(1, {message : "Mail is Required"}),
    website  : z.string().min(1, {message : "Website is Required"}),
    linkedIn  : z.string().min(1, {message : "Linkedin is Required"}),
    address_line_1  : z.string().min(1, {message : "Address line 1 is Required"}),
    address_line_2  : z.string().min(1, {message : "Address line 2 is Required"}),
    city  : z.string().min(1, {message : "City is Required"}),
    state  : z.string().min(1, {message : "State is Required"}),
    zipcode  : z.string().min(1, {message : "ZipCode is Required"}),


});

export const CompanySocialContactsForm = ({initialData, companyId} : CompanySocialContactsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
     const router = useRouter();
      const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
          mail: initialData?. mail || "",
          website: initialData.website || "",
          linkedIn: initialData.linkedIn || "",
          address_line_1: initialData.address_line_1 || "",
          address_line_2: initialData.address_line_2 || "",
          city: initialData.city || "",
          state: initialData.state || "",
          zipcode: initialData.zipcode || "",

        },
      });

    const {isSubmitting, isValid} = form.formState;

     const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
               const response = await axios.patch(`/api/companies/${companyId}`, values);
               toast.success("Company updated");
               toggleEditing();
               router.refresh();
        } catch (error) {
            toast.error("Something went Wrong");
        }
     };

     const toggleEditing = () => setIsEditing ((current) => !current)

 return   <div className="mt-6 border bg-neutral-100 rounded-md p-4 ">
                  <div className="font-medium flex items-center justify-between">
                    Company Social Contact
                    <Button onClick={toggleEditing} variant={"ghost"}>
                        {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
                    </Button>
                  </div>


                  {/* display the description if not editing */}
                  {!isEditing && (
                    <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        {initialData.mail && (
                          <div className="text-sm text-neutral-500 flex items-center w-full truncate">
                            <MailIcon className="w-3 h-3 mr-2"/>
                            {initialData.mail}
                          </div>
                      )}

                          {initialData.linkedIn && (
                          <Link href={initialData.linkedIn} className="text-sm text-neutral-500 flex items-center w-full truncate">
                            <Linkedin className="w-3 h-3 mr-2"/>
                            {initialData.linkedIn}
                          </Link>
                      )}

                          {initialData.website && (
                          <Link
                          href={initialData.website} 
                          className="text-sm text-neutral-500 flex items-center w-full truncate"
                          >
                            <Globe className="w-3 h-3 mr-2"/>
                            {initialData.website}
                          </Link>
                      )}

                      </div>
                      <div className="col-span-3">
                        {initialData.address_line_1 && (
                          <div className="flex items-start gap-2 justify-start">
                            <MapPin className="w-3 h-3 mt-1"/>
                             <div className="">
                              <p className="text-sm text-muted-foreground">
                                {initialData.address_line_1},{initialData.address_line_2},
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {initialData.city},{initialData.state} -{" "}
                                {initialData.zipcode}
                              </p>
                             </div>
                          </div>
                        )}
                      </div>

                    </div>
                    </>)}


                    {/* On Editing Mode Display the Input */}
                    {isEditing && (
  <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
  <FormField
  control={form.control}
  name ="mail"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Input
 disabled={isSubmitting}
 placeholder="Mail:`liveSat23@hotmail.com`"
 {...field}
 />
</FormControl>
<FormMessage/>
   </FormItem>
   )}
    />

<FormField
  control={form.control}
  name ="website"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Input
 disabled={isSubmitting}
 placeholder="Website Link:`https://company.liveSat@hotmail.com`"
 {...field}
 />
</FormControl>
<FormMessage/>
   </FormItem>
   )}
    />

<FormField
  control={form.control}
  name ="linkedIn"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Input
 disabled={isSubmitting}
 placeholder="Linkedin Link:`https://linkedin.in/@yourname`"
 {...field}
 />
</FormControl>
   </FormItem>
   )}
    />

<FormField
  control={form.control}
  name ="address_line_1"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Textarea
 disabled={isSubmitting}
 placeholder="Address Line 1"
 {...field}
 />
</FormControl>
   </FormItem>
   )}
    />
    <FormField
  control={form.control}
  name ="address_line_2"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Textarea
 disabled={isSubmitting}
 placeholder="Address Line 2"
 {...field}
 />
</FormControl>
   </FormItem>
   )}
    />

    <div className="grid grid-cols-3 gap-2">
    <FormField
  control={form.control}
  name ="city"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Input
 disabled={isSubmitting}
 placeholder="City"
 {...field}
 />
</FormControl>
   </FormItem>
   )}
    />

<FormField
  control={form.control}
  name ="state"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Input
 disabled={isSubmitting}
 placeholder="State"
 {...field}
 />
</FormControl>
   </FormItem>
   )}
    />

<FormField
  control={form.control}
  name ="zipcode"
         render={({field}) => (
  <FormItem>
<FormControl>
 <Input
 disabled={isSubmitting}
 placeholder="ZipCode"
 {...field}
 />
</FormControl>
   </FormItem>
   )}
    />
    </div>
<div className="flex items-center gap-x-2">
<Button disabled={!isValid || isSubmitting} type="submit">
  Save
</Button>
    </div>
    </form>
    </Form>
    )}
  </div>;
   };
