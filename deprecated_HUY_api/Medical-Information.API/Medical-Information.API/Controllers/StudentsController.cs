using AutoMapper;
using Medical_Information.API.Models.Domain;
using Medical_Information.API.Models.DTO;
using Medical_Information.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Information.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentRepository studentRepository;
        private readonly IMapper mapper;

        public StudentsController(IStudentRepository studentRepository, IMapper mapper)
        {
            this.studentRepository = studentRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            var studentsModel = await studentRepository.GetAllStudentsAsync();

            var studentsDTO = mapper.Map<List<StudentDTO>>(studentsModel);

            return Ok(studentsDTO);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetStudentByID([FromRoute] Guid id)
        {
            var studentModel = await studentRepository.GetStudentByIDAsync(id);

            if (studentModel == null)
            {
                return NotFound("Student not found");
            }

            return Ok(studentModel);
        }

        //[HttpPost]
        //public async Task<IActionResult> CreateStudent([FromBody] AddStudentRequestDTO addStudentRequestDTO)
        //{
        //    var existingStudent = await studentRepository.GetStudentByNameAsync(addStudentRequestDTO.Username);

        //    if (existingStudent != null)
        //    {
        //        return Conflict(new
        //        {
        //            message = "Student already existed",
        //            student = existingStudent
        //        });
        //    }

        //    var studentModel = mapper.Map<Student>(addStudentRequestDTO);

        //    await studentRepository.CreateStudentAsync(studentModel);

        //    var studentDTO = mapper.Map<StudentDTO>(studentModel);

        //    return CreatedAtAction(nameof(GetStudentByID), new { id = studentDTO.StudentID }, studentDTO);
        //}

        // [HttpPut]
        // [Route("{id:Guid}")]
        // public async Task<IActionResult> UpdateStudentPassword([FromRoute] Guid id, [FromBody] UpdatePasswordDTO dto)
        // {
        //     var studentModel = await studentRepository.UpdateStudentPasswordAsync(id, dto);

        //     if (studentModel == null)
        //     {
        //         return NotFound("Student not found");
        //     }

        //     var studentDTO = mapper.Map<StudentDTO>(studentModel);

        //     return Ok(studentDTO);
        // }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] Guid id)
        {
            var studentModel = await studentRepository.DeleteStudentAsync(id);

            if (studentModel == null)
            {
                return NotFound("Student not found");
            }

            var studentDTO = mapper.Map<StudentDTO>(studentModel);
            
            return Ok(studentDTO);
        }
    }
}
