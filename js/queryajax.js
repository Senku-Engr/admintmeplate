$(function(){
    FetchArticle()
    // $('#launch').on('click',function(){      use when there is no data-target 
    //   $('#basicExampleModal').modal('show')
    // })

    //  to get value from input
    $('#search').on('keyup',function(){
      console.log($('#search').val())
      searcharticle($('#search').val())
    })

    $('#save').on('click',function(){
      console.log($('#title').val())
      let article = {
        TITLE: $('#title').val(),
        DESCRIPTION: $('#desc').val(),
        IMAGE: $('#image').val()
      }
      // addarticle(article)
      if($('#modaltitle').text()=="add"){
        addarticle(article)
      }else{
        updatearticle(article,$('#aaid').val())
      }
    })

    $('#launch').on('click',function(){
      $('#basicExampleModal').modal('show')
      $('#modaltitle').text('add')
      $('#title').val('')
      $('#desc').val('')
      $('#image').val('')
    })

})

// search by title not id look at the req url linl mate
function searcharticle(title){
  $.ajax({
    url: `http://110.74.194.124:15011/v1/api/articles?title=${title}&page=1&limit=15`,
    method: 'get',
    success: function(res){
        appendarticle(res.DATA)
    },
    error: function(er){
        console.log(er)
    }
  })

}

function addarticle(article){
    $.ajax({
      url: 'http://110.74.194.124:15011/v1/api/articles',
      method: 'post',
      headers:{
         "Content-Type": "application/json",
         "Authorization" : "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
      },
      data: JSON.stringify(article),
      success: function(res){
        console.log(res)
        FetchArticle()
        $('#basicExampleModal').modal('hide')

      },
      error: function(er){
        console.log(er)
      }
    })
}

function FetchArticle(){
    $.ajax({
         url: 'http://110.74.194.124:15011/v1/api/articles?page=1&limit=15',
        // url: 'http://jsonplaceholder.typicode.com/photos',
        method: 'GET',
        success:  function(res){
            console.log(res)
            // let article = JSON.parse(this.response)
             appendarticle(res.DATA)
            // appendphoto(res)
        },
        error: function(er){
            console.log(er)
        }
    })
}

let content101 = ''
function appendphoto(photo){
    for(a of photo){
        content101 = `
        <tr>
          <th scope="row">${a.albumId}</th>
           <td>${a.id}</td>
           <td>${a.title}</td>
           <td>${subphoto(a.url)}</td>
           <td><img src=${a.thumbnailUrl}></img></td>
           <td class="btn btn-outline-primary waves">view</td>
        </tr>
        `
        $('tbody').append(content101)
    }
}


function subphoto(pic){
    let site = pic.substring(12,27)
    return site
}

function appendarticle(article){
    let content = ''

        for(a of article){
            content += `
            <tr>
              <th scope="row">${a.ID}</th>
               <td>${substring(a.CREATED_DATE)}</td>
               <td>${a.DESCRIPTION}</td>
               <td>${a.TITLE}</td>
               <td><img id="gg" src=${a.IMAGE}></img></td>
              <td>
                <button class="btn btn-outline-primary waves" onclick='goToDetail(${a.ID})' id='view'>view</button>
                <button class="btn btn-outline-danger waves" onclick='sweet(${a.ID})' >delete</button>
                <button class="btn btn-outline-danger waves" onclick='editarticle(this)' data-id=${a.ID} >edit</button>
              </td>
            </tr>
            `
            // $('tbody').append(content)
        }
        // $('tbody').html(content) html cannot use in the loop beacuse it replace content tmey
        $('tbody').html(content)



        // let tbody = document.querySelector('tbody')
        // tbody.innerHTML = content 
}
function editarticle(btnEdit){
    $('#basicExampleModal').modal('show')
    $('#modaltitle').text('edit')

    // let id = $(btnEdit).parent().siblings().eq(0).text()
    let title = $(btnEdit).parent().siblings().eq(2).text()
    let desc = $(btnEdit).parent().siblings().eq(3).text()
    let imageURL = $(btnEdit).parent().siblings().eq(4).find('img').attr('src')
    let id = $(btnEdit).attr('data-id')
    console.log(imageURL)
    console.log(id)
    
    $('#aaid').val(id)
    $('#title').val(title)
    $('#desc').val(desc)
    $('#image').val(imageURL)
    
}


function updatearticle(article,id){
  $.ajax({
    url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
    method: 'put',
    headers:{
       "Content-Type": "application/json",
       "Authorization" : "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
    },
    data: JSON.stringify(article),
    success: function(res){
      console.log(res)
      FetchArticle()
      $('#basicExampleModal').modal('hide')

    },
    error: function(er){
      console.log(er)
    }
  })
}


function sweet(aaid){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
              DeleteArticle(aaid),
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      })
      
}

function substring(art){
    let year = art.substring(0,4)
    let month = art.substring(4,6)
    let day = art.substring(6,8)
    let date = day+'/'+month+'/'+year
    let Date = [year,month,day]
    // console.log(date)
    return Date.join('-')
}

function goToDetail(id){
    window.location.href = `2query.html?id=${id}`
}

function DeleteArticle(delid){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles/${delid}`,
        method: 'delete',
        success: function(response){
            console.log(response)
            console.log("hellorrr")

            FetchArticle()
            console.log("hello")
        },
        error: function(er){
            console.log(er)
        }
    })
}