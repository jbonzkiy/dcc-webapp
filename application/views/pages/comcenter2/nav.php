<div id="firstloading" style="position:absolute;top:0;left:0;z-index:9999;height: 100%;width: 100%;background-color: #fff;">
	<div style="left: 50%; bottom: 50%; transform: translate(-50%, 47%); z-index: 9999;position: absolute;"><i class="mdi mdi-autorenew mdi-spin" style="font-size: 200px;color:#282923;"></i></div>
</div>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <span class="navbar-brand mb-0 h1"><i class="mdi mdi-radio-tower"></i>COMCENTER</span>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item <?php echo ($page == 'entry'?'active':''); ?>">
                <a class="nav-link" href="<?php echo base_url(); ?>comcenter2/entry">Data Entry</a>
            </li>
            <!-- <li class="nav-item <?php echo ($page == 'records'?'active':''); ?>">
                <a class="nav-link" href="<?php echo base_url(); ?>comcenter2/records">Records</a>
            </li> -->
        </ul>

        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <button type="button" class="btn btn-secondary dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Welcome <?php echo $uname; ?></button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                <?php if( $utype == 'admin' ) : ?>
                    <a class="dropdown-item" href="#">User Management</a>
                <?php endif; ?>
                    <a class="dropdown-item" href="<?php echo base_url(); ?>comcenter2/logout">Logout</a>
                </div>
            </li>
        </ul>
    </div>
</nav>